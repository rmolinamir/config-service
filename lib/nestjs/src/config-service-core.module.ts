import ConfigService, { ConfigModule } from '@config-service/core';
import {
  DynamicModule,
  FactoryProvider,
  Global,
  Module,
  Provider,
  Type
} from '@nestjs/common';
import { defer, lastValueFrom } from 'rxjs';
import { CONFIG_SERVICE_MODULE_OPTIONS } from './config-service.constants';
import {
  ConfigServiceModuleAsyncOptions,
  ConfigServiceModuleFactoryOptions,
  ConfigServiceModuleOptions,
  ConfigServiceOptionsFactory
} from './config-service-options.interfaces';
import { retry } from './helpers/retry';

@Global()
@Module({})
export class ConfigServicCoreModule {
  public static forRoot(
    configModules: ConfigModule[],
    options: ConfigServiceModuleOptions = {}
  ): DynamicModule {
    const { retryAttempts, retryDelay } = options;

    const configServiceProvider: FactoryProvider = {
      provide: ConfigService,
      useFactory: async (): Promise<unknown> =>
        await lastValueFrom(
          defer(async () => {
            const service = new ConfigService(...configModules);
            await service.load();
            return service;
          }).pipe(retry(retryAttempts, retryDelay))
        )
    };

    return {
      module: ConfigServicCoreModule,
      providers: [configServiceProvider],
      exports: [configServiceProvider]
    };
  }

  public static forRootAsync(
    options: ConfigServiceModuleAsyncOptions
  ): DynamicModule {
    const configServiceProvider = {
      provide: ConfigService,
      useFactory: async (
        configServiceModuleOptions: ConfigServiceModuleFactoryOptions
      ): Promise<unknown> => {
        const { configModules, retryAttempts, retryDelay } =
          configServiceModuleOptions;

        return await lastValueFrom(
          defer(async () => {
            const service = new ConfigService(...configModules);
            await service.load();
            return service;
          }).pipe(retry(retryAttempts, retryDelay))
        );
      },
      inject: [CONFIG_SERVICE_MODULE_OPTIONS]
    };

    const asyncProviders = this.createAsyncProviders(options);

    return {
      module: ConfigServicCoreModule,
      imports: options.imports,
      providers: [...asyncProviders, configServiceProvider],
      exports: [configServiceProvider]
    };
  }

  private static createAsyncProviders(
    options: ConfigServiceModuleAsyncOptions
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    const useClass = options.useClass as Type<ConfigServiceOptionsFactory>;

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass
      }
    ];
  }

  private static createAsyncOptionsProvider(
    options: ConfigServiceModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        provide: CONFIG_SERVICE_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || []
      };
    }

    // `as Type<ConfigServiceOptionsFactory>` is a workaround for microsoft/TypeScript#31603
    const inject = [
      (options.useClass ||
        options.useExisting) as Type<ConfigServiceOptionsFactory>
    ];

    return {
      provide: CONFIG_SERVICE_MODULE_OPTIONS,
      useFactory: async (optionsFactory: ConfigServiceOptionsFactory) =>
        await optionsFactory.createConfigServiceOptions(),
      inject
    };
  }
}
