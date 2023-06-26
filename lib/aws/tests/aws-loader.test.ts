import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { sdkStreamMixin } from '@aws-sdk/util-stream-node';
import { ConfigService } from '@config-service/core';
import { ConfigFilesFactory, faker } from '@config-service/testing';
import { mockClient } from 'aws-sdk-client-mock';
import fs from 'fs';

import { AwsLoader } from '../src';

@ConfigService.Register()
class JwtConfig {
  public accessTokenSecret!: string;

  public expiresTimeSpan!: string;
}

const jwt: JwtConfig = {
  accessTokenSecret: faker.string.alphanumeric(32),
  expiresTimeSpan: '1h'
};

describe('ConfigService', () => {
  const s3Mock = mockClient(S3Client);

  const s3Client = new S3Client({ region: 'us-east-1' });

  const loader = new AwsLoader(s3Client);
  const factory = new ConfigFilesFactory();

  let source: string;

  beforeAll(() => {
    source = factory.add(JwtConfig, jwt).path;
  });

  afterAll(() => {
    factory.cleanup();
  });

  beforeEach(() => {
    const stream = fs.createReadStream(source);

    s3Mock.on(GetObjectCommand).resolves({
      Body: sdkStreamMixin(stream)
    });
  });

  afterEach(() => {
    s3Mock.reset();
  });

  test('load', async () => {
    const file = await loader.load(`s3://some-bucket/path/to/file.json`);
    expect(s3Mock.calls()).toHaveLength(1);
    expect(file).toMatchObject(jwt);
  });

  describe('ConfigService', () => {
    const service = new ConfigService(loader);
    const s3Uri = `s3://some-bucket/path/to/file.json`;

    test('loads a config file', async () => {
      await expect(service.load(JwtConfig, s3Uri)).resolves.not.toThrow();
      expect(service.get(JwtConfig)).toMatchObject(jwt);
    });

    test('loading a config file twice does not throw', async () => {
      await expect(service.load(JwtConfig, s3Uri)).resolves.not.toThrow();
      await expect(service.load(JwtConfig, s3Uri)).resolves.not.toThrow();

      expect(service.get(JwtConfig)).toMatchObject(jwt);
    });
  });
});
