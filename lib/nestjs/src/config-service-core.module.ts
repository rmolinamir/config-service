import { ConfigLoader, ConfigService } from '@config-service/core';
import type {
  DynamicModule,
  FactoryProvider,
  Provider,
  Type
} from '@nestjs/common';
import {
  Global,
  Module,
} from '@nestjs/common';
import { defer, lastValueFrom } from 'rxjs';

import { OPTIONS_PROVIDER_TOKEN } from './config-service.constants.js';
import { retry } from './helpers/retry.js';
import type {
  ConfigOptions,
  ConfigServiceModuleAsyncOptions,
  ConfigServiceModuleFactoryOptions,
  ConfigServiceModuleOptions,
  ConfigServiceOptionsFactory
} from './types.js';

@Global()
@Module({})
export class ConfigServiceCoreModule {
  public static forRoot(
    loader: ConfigLoader,
    configs: ConfigOptions[],
    options: ConfigServiceModuleOptions
  ): DynamicModule {
    const configServiceProvider: FactoryProvider = {
      provide: ConfigService,
      useFactory: async (): Promise<unknown> => {
        const service = new ConfigService(loader);

        for (const config of configs) {
          const { Config, source } = config;
          const { retryAttempts, retryDelay } = config.options || options;
          try {
            await lastValueFrom(
              defer(async () => {
                await service.load(Config, source);
              }).pipe(retry(retryAttempts, retryDelay))
            );
          } catch (e) {
            console.error('Something went wrong: ', e);
            console.info('Retrying...');
          }
        }

        return service;
      }
    };

    return {
      module: ConfigServiceCoreModule,
      providers: [configServiceProvider],
      exports: [ConfigService]
    };
  }

  public static forRootAsync(
    asyncOptions: ConfigServiceModuleAsyncOptions
  ): DynamicModule {
    const configServiceProvider = {
      provide: ConfigService,
      useFactory: async ({
        loader,
        configs,
        options = {}
      }: ConfigServiceModuleFactoryOptions): Promise<unknown> => {
        const service = new ConfigService(loader);

        for (const config of configs) {
          const { Config, source } = config;
          const { retryAttempts, retryDelay } = options;
          try {
            await lastValueFrom(
              defer(async () => {
                await service.load(Config, source);
              }).pipe(retry(retryAttempts, retryDelay))
            );
          } catch (e) {
            console.error('Something went wrong: ', e);
            console.info('Retrying...');
          }
        }

        return service;
      },
      inject: [OPTIONS_PROVIDER_TOKEN]
    };

    return {
      module: ConfigServiceCoreModule,
      imports: asyncOptions.imports,
      providers: [
        configServiceProvider,
        ...this.asyncOptionsProviders(asyncOptions)
      ],
      exports: [ConfigService]
    };
  }

  private static asyncOptionsProviders(
    asyncOptions: ConfigServiceModuleAsyncOptions
  ): Provider[] {
    if (asyncOptions.useExisting || asyncOptions.useFactory)
      return [this.factoryOptionsProvider(asyncOptions)];

    const useClass = asyncOptions.useClass as Type<ConfigServiceOptionsFactory>;

    return [
      this.factoryOptionsProvider(asyncOptions),
      {
        provide: useClass,
        useClass
      }
    ];
  }

  private static factoryOptionsProvider(
    options: ConfigServiceModuleAsyncOptions
  ): Provider<ConfigServiceModuleFactoryOptions> {
    if (options.useFactory) {
      return {
        provide: OPTIONS_PROVIDER_TOKEN,
        useFactory: options.useFactory,
        inject: options.inject || []
      };
    }

    const inject = [options.useClass || options.useExisting] as [
      Type<ConfigServiceOptionsFactory>
    ];

    return {
      provide: OPTIONS_PROVIDER_TOKEN,
      useFactory: async (factory: ConfigServiceOptionsFactory) =>
        await factory.createConfigServiceOptions(),
      inject
    };
  }
}
