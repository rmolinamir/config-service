import ConfigService from '@config-service/core';
import { Test, TestingModule } from '@nestjs/testing';
import * as RetryHelper from '../src/helpers/retry';
import { dbConnectionStringModule } from './fixtures/db';
import { expressModule } from './fixtures/express';
import { redisModule } from './fixtures/redis';
import { nestedModule } from './fixtures/nested';
import { nestedArrayModule } from './fixtures/nestedArray';
import { ConfigServiceModule } from '../src/config-service.module';
import { errorModule } from './fixtures/error';

describe('ConfigServiceModule', () => {
  describe('fixtures', () => {
    const config = new ConfigService(
      dbConnectionStringModule,
      expressModule,
      redisModule,
      nestedModule,
      nestedArrayModule
    );

    test('config module fixtures correctly load', async () => {
      await config.load();
      expect(config.modules.db).toBeDefined();
      expect(config.modules.db.dbConnectionString).toBeDefined();
      expect(config.modules.express).toBeDefined();
      expect(config.modules.express.sessionSecretKey).toBeDefined();
      expect(config.modules.redis).toBeDefined();
      expect(config.modules.nested).toBeDefined();
      expect(config.modules.nestedArray).toBeDefined();
      expect(config.modules.nested.foo.bar.baz).toBeDefined();
      expect(
        typeof config.modules.nested.foo.bar.baz === 'string'
      ).toBeDefined();
    });
  });

  describe('forRoot', () => {
    const modules = [
      dbConnectionStringModule,
      expressModule,
      redisModule,
      nestedModule,
      nestedArrayModule
    ];

    let moduleRef: TestingModule;
    let config: ConfigService<typeof modules>;

    beforeEach(async () => {
      moduleRef = await Test.createTestingModule({
        imports: [ConfigServiceModule.forRoot(modules)]
      }).compile();

      config = moduleRef.get(ConfigService);
    });

    afterEach(async () => {
      await moduleRef?.close();
    });

    test('loads', () => {
      expect(config.modules.db).toBeDefined();
      expect(config.modules.db.dbConnectionString).toBeDefined();
      expect(config.modules.express).toBeDefined();
      expect(config.modules.express.sessionSecretKey).toBeDefined();
      expect(config.modules.redis).toBeDefined();
      expect(config.modules.nested).toBeDefined();
      expect(config.modules.nestedArray).toBeDefined();
      expect(config.modules.nested.foo.bar.baz).toBeDefined();
      expect(
        typeof config.modules.nested.foo.bar.baz === 'string'
      ).toBeDefined();
    });
  });

  describe('forRootAsync', () => {
    const modules = [
      dbConnectionStringModule,
      expressModule,
      redisModule,
      nestedModule,
      nestedArrayModule
    ];

    let moduleRef: TestingModule;
    let config: ConfigService<typeof modules>;

    beforeEach(async () => {
      moduleRef = await Test.createTestingModule({
        imports: [
          ConfigServiceModule.forRootAsync({
            useFactory: async () => {
              return {
                configModules: await Promise.resolve(modules)
              };
            }
          })
        ]
      }).compile();

      config = moduleRef.get(ConfigService);
    });

    afterEach(async () => {
      await moduleRef?.close();
    });

    test('loads', () => {
      expect(config.modules.db).toBeDefined();
      expect(config.modules.db.dbConnectionString).toBeDefined();
      expect(config.modules.express).toBeDefined();
      expect(config.modules.express.sessionSecretKey).toBeDefined();
      expect(config.modules.redis).toBeDefined();
      expect(config.modules.nested).toBeDefined();
      expect(config.modules.nestedArray).toBeDefined();
      expect(config.modules.nested.foo.bar.baz).toBeDefined();
      expect(
        typeof config.modules.nested.foo.bar.baz === 'string'
      ).toBeDefined();
    });
  });

  describe('forFeature', () => {
    const modules = [
      dbConnectionStringModule,
      expressModule,
      redisModule,
      nestedModule,
      nestedArrayModule
    ];

    let moduleRef: TestingModule;

    beforeAll(async () => {
      moduleRef = await Test.createTestingModule({
        imports: [ConfigServiceModule.forFeature(modules)]
      }).compile();
    });

    afterAll(async () => {
      await moduleRef?.close();
    });

    test('db', () => {
      const db = moduleRef.get<
        Awaited<ReturnType<typeof dbConnectionStringModule['load']>>
      >(dbConnectionStringModule.key);
      expect(db).toBeDefined();
      expect(db.dbConnectionString).toBeDefined();
    });

    test('express', () => {
      const express = moduleRef.get<
        Awaited<ReturnType<typeof expressModule['load']>>
      >(expressModule.key);
      expect(express).toBeDefined();
      expect(express.sessionSecretKey).toBeDefined();
    });

    test('redis', () => {
      const redis = moduleRef.get<
        Awaited<ReturnType<typeof redisModule['load']>>
      >(redisModule.key);
      expect(redis).toBeDefined();
      expect(redis.db).toBeDefined();
      expect(redis.family).toBeDefined();
      expect(redis.host).toBeDefined();
      expect(redis.password).toBeDefined();
      expect(redis.port).toBeDefined();
    });

    test('nested', () => {
      const nested = moduleRef.get<
        Awaited<ReturnType<typeof nestedModule['load']>>
      >(nestedModule.key);
      expect(nested).toBeDefined();
      expect(nested.foo).toBeDefined();
      expect(nested.foo.bar).toBeDefined();
      expect(nested.foo.bar.baz).toBeDefined();
    });

    test('nestedArray', () => {
      const nestedArray = moduleRef.get<
        Awaited<ReturnType<typeof nestedArrayModule['load']>>
      >(nestedArrayModule.key);
      expect(nestedArray).toBeDefined();
      expect(nestedArray.foo).toBeDefined();
      expect(nestedArray.foo[0].bar).toBeDefined();
      expect(nestedArray.foo[0].bar.foobar).toBeDefined();
      expect(nestedArray.foo[0].baz).toBeDefined();
    });
  });

  describe('forFeatureAsync', () => {
    const modules = [
      dbConnectionStringModule,
      expressModule,
      redisModule,
      nestedModule,
      nestedArrayModule
    ];

    let moduleRef: TestingModule;

    beforeAll(async () => {
      moduleRef = await Test.createTestingModule({
        imports: [
          ConfigServiceModule.forFeatureAsync(
            modules.map((m) => ({
              provide: m.key,
              useFactory: async () => {
                return await Promise.resolve(m);
              }
            }))
          )
        ]
      }).compile();
    });

    afterAll(async () => {
      await moduleRef?.close();
    });

    test('db', () => {
      const db = moduleRef.get<
        Awaited<ReturnType<typeof dbConnectionStringModule['load']>>
      >(dbConnectionStringModule.key);
      expect(db).toBeDefined();
      expect(db.dbConnectionString).toBeDefined();
    });

    test('express', () => {
      const express = moduleRef.get<
        Awaited<ReturnType<typeof expressModule['load']>>
      >(expressModule.key);
      expect(express).toBeDefined();
      expect(express.sessionSecretKey).toBeDefined();
    });

    test('redis', () => {
      const redis = moduleRef.get<
        Awaited<ReturnType<typeof redisModule['load']>>
      >(redisModule.key);
      expect(redis).toBeDefined();
      expect(redis.db).toBeDefined();
      expect(redis.family).toBeDefined();
      expect(redis.host).toBeDefined();
      expect(redis.password).toBeDefined();
      expect(redis.port).toBeDefined();
    });

    test('nested', () => {
      const nested = moduleRef.get<
        Awaited<ReturnType<typeof nestedModule['load']>>
      >(nestedModule.key);
      expect(nested).toBeDefined();
      expect(nested.foo).toBeDefined();
      expect(nested.foo.bar).toBeDefined();
      expect(nested.foo.bar.baz).toBeDefined();
    });

    test('nestedArray', () => {
      const nestedArray = moduleRef.get<
        Awaited<ReturnType<typeof nestedArrayModule['load']>>
      >(nestedArrayModule.key);
      expect(nestedArray).toBeDefined();
      expect(nestedArray.foo).toBeDefined();
      expect(nestedArray.foo[0].bar).toBeDefined();
      expect(nestedArray.foo[0].bar.foobar).toBeDefined();
      expect(nestedArray.foo[0].baz).toBeDefined();
    });
  });

  describe('retries', () => {
    const retryOnSpy = jest.spyOn(RetryHelper, 'retry');
    const retryAttempts = 5;
    const retryDelay = 10;

    beforeAll(async () => {
      try {
        await Test.createTestingModule({
          imports: [
            ConfigServiceModule.forRoot([errorModule], {
              retryAttempts,
              retryDelay
            })
          ]
        }).compile();
      } catch {
        // Do nothing.
      }
    });

    afterAll(async () => {
      jest.clearAllMocks();
    });

    test('retries', () => {
      expect(retryOnSpy).toBeCalledWith(retryAttempts, retryDelay);
    });
  });
});
