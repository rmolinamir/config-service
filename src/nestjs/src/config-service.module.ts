import { ConfigModule } from '@config-service/core';
import { DynamicModule, flatten, Module } from '@nestjs/common';
import { ConfigModuleAsyncFactory } from './config-module-async-factory.interface';
import { ConfigServicCoreModule } from './config-service-core.module';
import {
  ConfigServiceModuleAsyncOptions,
  ConfigServiceModuleOptions
} from './config-service-options.interfaces';
import {
  createConfigServiceAsyncProviders,
  createConfigServiceProviders
} from './config-service.providers';

@Module({})
export class ConfigServiceModule {
  public static forRoot(
    configModules: ConfigModule[],
    options: ConfigServiceModuleOptions = {}
  ): DynamicModule {
    return {
      module: ConfigServiceModule,
      imports: [ConfigServicCoreModule.forRoot(configModules, options)]
    };
  }

  public static forRootAsync(
    options: ConfigServiceModuleAsyncOptions
  ): DynamicModule {
    return {
      module: ConfigServiceModule,
      imports: [ConfigServicCoreModule.forRootAsync(options)]
    };
  }

  public static forFeature(configModules: ConfigModule[]): DynamicModule {
    const providers = createConfigServiceProviders(configModules);

    return {
      module: ConfigServiceModule,
      providers,
      exports: providers
    };
  }

  public static forFeatureAsync(
    factories: ConfigModuleAsyncFactory[] = []
  ): DynamicModule {
    const providers = createConfigServiceAsyncProviders(factories);
    const imports = factories.map((factory) => factory.imports || []);
    const uniqImports = new Set(flatten(imports));

    return {
      module: ConfigServiceModule,
      imports: Array.from(uniqImports),
      providers,
      exports: providers
    };
  }
}
