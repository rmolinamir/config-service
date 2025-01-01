import os from 'os';
import path from 'path';
import { describe, expect, test } from 'vitest';
import { ConfigService, FileLoader } from '@config-service/core';
import { ConfigFilesFactory, faker } from '@config-service/testing';
import { ConfigRegistry } from '../index.js';
import { JwtConfig } from './jwt-config.js';

describe('ConfigRegistry', () => {
  const tmpDir = os.tmpdir();

  const factory = new ConfigFilesFactory(tmpDir);
  const service = new ConfigService(new FileLoader());

  const jwtData: JwtConfig = {
    secret: faker.string.alphanumeric(32),
    expiresIn: '1h'
  };

  test('instance', async () => {
    const registry = new ConfigRegistry({ location: tmpDir });

    const uri = factory.add(JwtConfig, jwtData);

    registry.register(JwtConfig, path.basename(uri.path));

    const jwtLocation = registry.location(JwtConfig);

    await service.load(JwtConfig, jwtLocation);

    expect(service.get(JwtConfig)).toMatchObject(jwtData);
  });
});
