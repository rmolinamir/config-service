import { ConfigLoader, ConfigService } from '@config-service/core';
import { Config } from '@config-service/core/config';
import { DynamicModule, flatten, Module, Provider } from '@nestjs/common';

import { ConfigServiceCoreModule } from './config-service-core.module';
import {
  ConfigModuleAsyncFactory,
  ConfigOptions,
  ConfigServiceModuleAsyncOptions,
  ConfigServiceModuleOptions
} from './types';

@Module({})
export class ConfigServiceModule {
  /**
   * Configures the ConfigService NestJS module.
   * Configurations are only loaded once because the internal module is global.
   */
  public static forRoot(
    loader: ConfigLoader,
    configs: ConfigOptions[],
    options: ConfigServiceModuleOptions = {}
  ): DynamicModule {
    return {
      module: ConfigServiceModule,
      imports: [ConfigServiceCoreModule.forRoot(loader, configs, options)]
    };
  }

  /**
   * Configures the ConfigService NestJS module.
   * Configurations are only loaded once because the internal module is global.
   */
  public static forRootAsync(
    options: ConfigServiceModuleAsyncOptions
  ): DynamicModule {
    return {
      module: ConfigServiceModule,
      imports: [ConfigServiceCoreModule.forRootAsync(options)]
    };
  }

  /**
   * Makes use of the configuration from `forRoot` or `forRootAsync` to return Config providers.
   */
  public static forFeature(configs: Config[]): DynamicModule {
    const providers = configs.reduce<Provider[]>((providers, Config) => {
      providers.push({
        provide: Config,
        useFactory: async (service: ConfigService) => {
          return service.get(Config);
        },
        inject: [ConfigService]
      });
      return providers;
    }, []);

    return {
      module: ConfigServiceModule,
      providers,
      exports: providers
    };
  }

  /**
   * Makes use of the configuration from `forRoot` or `forRootAsync` to return Config providers.
   */
  public static forFeatureAsync(
    factories: ConfigModuleAsyncFactory[]
  ): DynamicModule {
    const factoryImports = factories.map((factory) => factory.imports || []);
    const imports = Array.from(new Set(flatten(factoryImports)));

    const providers = factories.reduce<Provider[]>((providers, factory) => {
      providers.push({
        provide: factory.provide,
        useFactory: async (service: ConfigService, ...args: unknown[]) => {
          const Config = await factory.useFactory(...args);
          return service.get(Config);
        },
        inject: [ConfigService, ...(factory.inject || [])]
      });

      return providers;
    }, []);

    return {
      module: ConfigServiceModule,
      imports,
      providers,
      exports: providers
    };
  }
}
