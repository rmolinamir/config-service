import { describe, expect, test } from 'vitest';
import { ConfigLoader, ConfigService, FileLoader } from '@config-service/core';
import { faker } from '@config-service/testing';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ConfigServiceModule,
  ConfigServiceModuleFactoryOptions
} from '../src/index';
import { JwtConfig } from './configs/jwt-config';
import { MongoDbConfig } from './configs/mongodb-config';
import { RedisConfig } from './configs/redis-config';
import { ServerConfig } from './configs/server-config';
import { ConfigFilesFactory } from './helpers/config-file-factory';

describe('ConfigServiceModule', () => {
  const factory = new ConfigFilesFactory();

  const jwtData: JwtConfig = {
    secret: faker.string.alphanumeric(32),
    expiresIn: '1h'
  };

  const mongoDbData: MongoDbConfig = {
    uri: faker.internet.url(),
    dbName: faker.string.alphanumeric(10)
  };

  const redisData: RedisConfig = {
    host: faker.internet.ip(),
    port: faker.datatype.number(),
    password: faker.string.alphanumeric(32),
    db: faker.datatype.number()
  };

  const serverConfigData: ServerConfig = {
    host: faker.internet.ip(),
    port: faker.datatype.number()
  };

  const jwtConfigPath = factory.add(JwtConfig, jwtData);
  const mongoDbConfigPath = factory.add(MongoDbConfig, mongoDbData);
  const redisConfigPath = factory.add(RedisConfig, redisData);
  const serverConfigPath = factory.add(ServerConfig, serverConfigData);

  test('forRoot', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigServiceModule.forRoot(new FileLoader(), [
          { Config: JwtConfig, source: jwtConfigPath },
          { Config: MongoDbConfig, source: mongoDbConfigPath },
          { Config: RedisConfig, source: redisConfigPath },
          { Config: ServerConfig, source: serverConfigPath }
        ])
      ]
    }).compile();

    const service = module.get(ConfigService);

    expect(service.get(JwtConfig)).toMatchObject(jwtData);
    expect(service.get(MongoDbConfig)).toMatchObject(mongoDbData);
    expect(service.get(RedisConfig)).toMatchObject(redisData);
    expect(service.get(ServerConfig)).toMatchObject(serverConfigData);
  });

  test('forRootAsync', async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigServiceModule.forRootAsync({
          useFactory: async () => {
            const options = new Promise<ConfigServiceModuleFactoryOptions>(
              (resolve) =>
                resolve({
                  loader: new FileLoader(),
                  configs: [
                    { Config: JwtConfig, source: jwtConfigPath },
                    { Config: MongoDbConfig, source: mongoDbConfigPath },
                    { Config: RedisConfig, source: redisConfigPath },
                    { Config: ServerConfig, source: serverConfigPath }
                  ],
                  options: {
                    retryAttempts: 5,
                    retryDelay: 1000
                  }
                })
            );

            return await options;
          }
        })
      ],
      providers: [{ provide: ConfigLoader, useClass: FileLoader }]
    }).compile();

    const service = moduleRef.get(ConfigService);

    expect(service.get(JwtConfig)).toMatchObject(jwtData);
  });

  test('forFeature', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigServiceModule.forRoot(
          new FileLoader(),
          [{ Config: JwtConfig, source: jwtConfigPath }],
          {
            retryAttempts: 5,
            retryDelay: 1000
          }
        ),
        ConfigServiceModule.forFeature([JwtConfig])
      ],
      providers: [{ provide: ConfigLoader, useClass: FileLoader }]
    }).compile();

    expect(module.get(JwtConfig)).toMatchObject(jwtData);
  });

  test('forFeatureAsync', async () => {
    const JWT_PROVIDER_TOKEN = Symbol('JWT_PROVIDER_TOKEN');

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigServiceModule.forRootAsync({
          useFactory: async () => {
            const options = new Promise<ConfigServiceModuleFactoryOptions>(
              (resolve) =>
                resolve({
                  loader: new FileLoader(),
                  configs: [{ Config: JwtConfig, source: jwtConfigPath }],
                  options: {
                    retryAttempts: 5,
                    retryDelay: 1000
                  }
                })
            );

            return await options;
          }
        }),
        ConfigServiceModule.forFeatureAsync([
          {
            provide: JWT_PROVIDER_TOKEN,
            useFactory: async () => {
              return JwtConfig;
            }
          }
        ])
      ],
      providers: [{ provide: ConfigLoader, useClass: FileLoader }]
    }).compile();

    expect(module.get(JWT_PROVIDER_TOKEN)).toMatchObject(jwtData);
  });
});
