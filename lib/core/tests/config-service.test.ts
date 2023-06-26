import { faker } from '@config-service/testing';

import { FileLoader } from '../src';
import { ConfigService } from '../src/config-service';
import { ExcludeFunctionsOf } from '../src/types/exclude-functions-of';
import { ConfigFilesFactory } from './config-file-factory';

describe('ConfigService', () => {
  const service = new ConfigService(new FileLoader());
  const factory = new ConfigFilesFactory();

  afterAll(() => {
    factory.cleanup();
  });

  describe('API', () => {
    @ConfigService.Register()
    class JwtConfig {
      public accessTokenSecret!: string;

      public expiresTimeSpan!: string;

      public uselessFunction(): void {}
    }

    const jwt: ExcludeFunctionsOf<JwtConfig> = {
      accessTokenSecret: faker.string.alphanumeric(32),
      expiresTimeSpan: '1h'
    };

    let jwtConfigPath: string;

    beforeAll(() => {
      jwtConfigPath = factory.add(JwtConfig, jwt);
    });

    test('loads a config file', async () => {
      await expect(
        service.load(JwtConfig, jwtConfigPath)
      ).resolves.not.toThrow();

      expect(service.get(JwtConfig)).toBeTruthy();
    });

    test('loading a config file twice does not throw', async () => {
      await expect(
        service.load(JwtConfig, jwtConfigPath)
      ).resolves.not.toThrow();
      await expect(
        service.load(JwtConfig, jwtConfigPath)
      ).resolves.not.toThrow();

      expect(service.get(JwtConfig)).toBeTruthy();
    });

    test('get', async () => {
      await service.load(JwtConfig, jwtConfigPath);

      const config = service.get(JwtConfig);

      expect(config.accessTokenSecret).toBe(jwt.accessTokenSecret);
      expect(config.expiresTimeSpan).toBe(jwt.expiresTimeSpan);
    });
  });

  describe('Register', () => {
    const transformer = jest
      .fn()
      .mockImplementation((ConfigClass, data) =>
        Object.assign(new ConfigClass(), data)
      );

    const validator = jest.fn().mockImplementation((config) => {
      if (!config.google || !config.facebook)
        throw new Error('Config is invalid.');
    });

    @ConfigService.Register({
      transformer,
      validator
    })
    class ApiKeysConfig {
      public google!: string;

      public facebook!: string;

      public uselessFunction(): void {}
    }

    const apiKeys: ExcludeFunctionsOf<ApiKeysConfig> = {
      google: faker.string.alphanumeric(32),
      facebook: faker.string.alphanumeric(32)
    };

    let apiKeysPath: string;

    beforeAll(() => {
      apiKeysPath = factory.add(ApiKeysConfig, apiKeys);
    });

    test('decorator', async () => {
      await service.load(ApiKeysConfig, apiKeysPath);

      expect(transformer).toHaveBeenCalled();
      expect(validator).toHaveBeenCalled();

      const config = service.get(ApiKeysConfig);

      expect(config.google).toBeTruthy();
      expect(config.facebook).toBeTruthy();
    });

    test('throws if config is already registered', () => {
      expect(() => {
        @ConfigService.Register()
        @ConfigService.Register()
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class JwtConfig {
          public accessTokenSecret!: string;

          public expiresTimeSpan!: string;

          public uselessFunction(): void {}
        }
      }).toThrow();
    });
  });
});
