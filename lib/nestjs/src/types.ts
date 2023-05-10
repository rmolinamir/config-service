import { Config } from '@config-service/core/config';
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

export interface ConfigOptions {
  Config: Config;
  source: string;
  options?: ConfigServiceModuleOptions;
}

export interface ConfigServiceOptionsFactory {
  createConfigServiceOptions():
    | Promise<ConfigServiceModuleFactoryOptions>
    | ConfigServiceModuleFactoryOptions;
}

export type ConfigServiceModuleFactoryOptions = {
  configs: ConfigOptions[];
  options?: ConfigServiceModuleOptions;
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

export interface ConfigModuleAsyncFactory
  extends Pick<ModuleMetadata, 'imports'> {
  provide: InjectionToken;
  useFactory: (...args: unknown[]) => Promise<Config> | Config;
  inject?: (InjectionToken | OptionalFactoryDependency)[];
}
