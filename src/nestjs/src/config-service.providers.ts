import { ConfigModule } from '@config-service/core';
import { Provider } from '@nestjs/common';
import { ConfigModuleAsyncFactory } from './config-module-async-factory.interface';

export function createConfigServiceProviders(
  configModules: ConfigModule[]
): Provider[] {
  return configModules.reduce<Provider[]>((providers, module) => {
    providers.push({
      provide: module.key,
      useFactory: async () => {
        const loadedConfigModuleData = await module.load();
        return loadedConfigModuleData;
      }
    });
    return providers;
  }, []);
}

export function createConfigServiceAsyncProviders(
  moduleFactories: ConfigModuleAsyncFactory[] = []
): Provider[] {
  return moduleFactories.reduce<Provider[]>((providers, factory) => {
    providers.push({
      provide: factory.provide,
      useFactory: async (...args: unknown[]) => {
        const module = await factory.useFactory(...args);
        const loadedConfigModuleData = await module.load();
        return loadedConfigModuleData;
      },
      inject: [...(factory.inject || [])]
    });

    return providers;
  }, []);
}
