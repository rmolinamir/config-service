import { faker } from '@faker-js/faker';

import { ConfigModuleState } from '../src/config-module-state';
import { ConfigService } from '../src/config-service';
import { ExcludeFunctionsOf } from '../src/types/exclude-functions-of';
import { ConfigFiles } from './helpers/config-file-mocker';

describe('ConfigService', () => {
  const service = new ConfigService();
  const store = new ConfigFiles();

  afterAll(() => {
    store.cleanup();
  });

  describe('API', () => {
    @ConfigService.Register()
    class JwtConfig {
      public accessTokenSecret!: string;

      public expiresTimeSpan!: string;

      public uselessFunction(): void {}
    }

    const jwt: ExcludeFunctionsOf<JwtConfig> = {
      accessTokenSecret: faker.random.alphaNumeric(32),
      expiresTimeSpan: '1h'
    };

    beforeAll(() => {
      store.add(JwtConfig, jwt);
    });

    test('loads a config file', async () => {
      await expect(
        service.load(JwtConfig, store.path(JwtConfig))
      ).resolves.not.toThrow();

      expect(service.get(JwtConfig)).toBeTruthy();
    });

    test('loading a config file twice does not throw', async () => {
      await expect(
        service.load(JwtConfig, store.path(JwtConfig))
      ).resolves.not.toThrow();
      await expect(
        service.load(JwtConfig, store.path(JwtConfig))
      ).resolves.not.toThrow();

      expect(service.get(JwtConfig)).toBeTruthy();
    });

    test('get', async () => {
      await service.load(JwtConfig, store.path(JwtConfig));

      const config = service.get(JwtConfig);

      expect(config.accessTokenSecret).toBe(jwt.accessTokenSecret);
      expect(config.expiresTimeSpan).toBe(jwt.expiresTimeSpan);
    });
  });

  describe('Register', () => {
    test('decorator', () => {
      const loader = jest.fn();
      const transformer = jest.fn();
      const validator = jest.fn();

      @ConfigService.Register({
        loader,
        transformer,
        validator
      })
      class ApiKeysConfig {
        public google!: string;

        public facebook!: string;

        public uselessFunction(): void {}
      }

      const module = service.module(ApiKeysConfig);

      expect(module).toBeTruthy();
      expect(module?.Class).toBe(ApiKeysConfig);
      expect(module?.config).toBe(null);
      expect(module?.options.loader).toBe(loader);
      expect(module?.options.transformer).toBe(transformer);
      expect(module?.options.validator).toBe(validator);
      expect(module?.state).toBe(ConfigModuleState.UNLOADED);
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

    test('custom pipes', async () => {
      @ConfigService.Register({
        loader: jest.fn().mockResolvedValue(
          JSON.stringify({
            google: faker.random.alphaNumeric(32),
            facebook: faker.random.alphaNumeric(32)
          })
        ),
        transformer: jest.fn().mockImplementation((data) => JSON.parse(data)),
        validator: jest.fn().mockImplementation((config) => {
          if (!config.google || !config.facebook)
            throw new Error('Config is invalid.');
        })
      })
      class ApiKeysConfig {
        public google!: string;

        public facebook!: string;

        public uselessFunction(): void {}
      }

      const module = service.module(ApiKeysConfig);

      expect(module).toBeTruthy();

      await service.load(ApiKeysConfig, 'file:///api-keys.json');

      expect(module!.options.loader).toHaveBeenCalled();
      expect(module!.options.transformer).toHaveBeenCalled();
      expect(module!.options.validator).toHaveBeenCalled();

      const config = service.get(ApiKeysConfig);

      expect(config.google).toBeTruthy();
      expect(config.facebook).toBeTruthy();
    });
  });
});
