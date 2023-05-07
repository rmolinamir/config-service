import { ConfigModule } from '@config-service/core';
import {
  InjectionToken,
  ModuleMetadata,
  OptionalFactoryDependency,
  Type
} from '@nestjs/common';

export interface ConfigServiceModuleOptions {
  retryAttempts?: number;
  retryDelay?: number;
}

export interface ConfigServiceOptionsFactory {
  createConfigServiceOptions():
    | Promise<ConfigServiceModuleOptions>
    | ConfigServiceModuleOptions;
}

export type ConfigServiceModuleFactoryOptions = ConfigServiceModuleOptions & {
  configModules: ConfigModule[];
};

export interface ConfigServiceModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<ConfigServiceOptionsFactory>;
  useClass?: Type<ConfigServiceOptionsFactory>;
  useFactory?: (
    ...args: unknown[]
  ) =>
    | Promise<ConfigServiceModuleFactoryOptions>
    | ConfigServiceModuleFactoryOptions;
  inject?: (InjectionToken | OptionalFactoryDependency)[];
}
