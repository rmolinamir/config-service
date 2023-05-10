import { ConfigService } from '@config-service/core';
import { ConfigFilesFactory } from '@config-service/testing';
import { faker } from '@faker-js/faker';
import { IsNumber, IsString } from 'class-validator';

import { TypeStack } from '../src/typestack';

describe('TypeStack', () => {
  const service = new ConfigService();
  const factory = new ConfigFilesFactory();

  afterAll(() => {
    factory.cleanup();
  });

  test('integration', async () => {
    const typeStack = TypeStack();

    const transformerSpy = jest.spyOn(typeStack, 'transformer');
    const validatorSpy = jest.spyOn(typeStack, 'validator');

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
        google: faker.random.alphaNumeric(32),
        facebook: faker.random.alphaNumeric(32)
      })
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
        google: faker.random.alphaNumeric(32),
        facebook: faker.random.alphaNumeric(32)
      })
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

    const apiKeysPath = factory.add(ApiKeysConfig, {
      google: faker.random.alphaNumeric(32),
      facebook: faker.random.alphaNumeric(32)
    });

    await expect(
      service.load(ApiKeysConfig, apiKeysPath)
    ).rejects.toThrowError();
  });
});
