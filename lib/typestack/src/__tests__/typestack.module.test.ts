import { IsNumber, IsString } from 'class-validator';
import { afterAll, describe, expect, test, vi } from 'vitest';
import { ConfigService, FileLoader } from '@config-service/core';
import { ConfigFilesFactory, faker } from '@config-service/testing';
import { TypeStack } from '../typestack.js';

describe('TypeStack', () => {
  const service = new ConfigService(new FileLoader());
  const factory = new ConfigFilesFactory();

  afterAll(() => {
    factory.cleanup();
  });

  test('integration', async () => {
    const typeStack = TypeStack();

    const transformerSpy = vi.spyOn(typeStack, 'transformer');
    const validatorSpy = vi.spyOn(typeStack, 'validator');

    @ConfigService.Register(typeStack)
    class ApiKeysConfig {
      @IsString()
      public google!: string;

      @IsString()
      public facebook!: string;

      public uselessFunction(): void {}
    }

    await service.load(
      ApiKeysConfig,
      factory.add(ApiKeysConfig, {
        google: faker.string.alphanumeric(32),
        facebook: faker.string.alphanumeric(32)
      }).value
    );

    expect(transformerSpy).toHaveBeenCalled();
    expect(validatorSpy).toHaveBeenCalled();

    const config = service.get(ApiKeysConfig);

    expect(config.google).toBeTruthy();
    expect(config.facebook).toBeTruthy();
  });

  test('transformer', async () => {
    @ConfigService.Register(TypeStack())
    class ApiKeysConfig {
      @IsString()
      public google!: string;

      @IsString()
      public facebook!: string;
    }

    await service.load(
      ApiKeysConfig,
      factory.add(ApiKeysConfig, {
        google: faker.string.alphanumeric(32),
        facebook: faker.string.alphanumeric(32)
      }).value
    );

    const config = service.get(ApiKeysConfig);

    expect(config).toBeInstanceOf(ApiKeysConfig);
    expect(config.google).toBeTruthy();
    expect(config.facebook).toBeTruthy();
  });

  test('validator', async () => {
    @ConfigService.Register(TypeStack())
    class ApiKeysConfig {
      @IsNumber()
      public google!: string;

      @IsNumber()
      public facebook!: string;
    }

    await expect(
      service.load(
        ApiKeysConfig,
        factory.add(ApiKeysConfig, {
          google: faker.string.alphanumeric(32),
          facebook: faker.string.alphanumeric(32)
        }).value
      )
    ).rejects.toThrowError();
  });
});
