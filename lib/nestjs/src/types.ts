/* eslint-disable @typescript-eslint/no-explicit-any */

import { ConfigLoader } from '@config-service/core';
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

export type ConfigServiceModuleFactoryOptions = {
  loader: ConfigLoader;
  configs: ConfigOptions[];
  options?: ConfigServiceModuleOptions;
};

export interface ConfigServiceOptionsFactory {
  createConfigServiceOptions():
    | Promise<ConfigServiceModuleFactoryOptions>
    | ConfigServiceModuleFactoryOptions;
}

export interface ConfigServiceModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<ConfigServiceOptionsFactory>;
  useClass?: Type<ConfigServiceOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) =>
    | Promise<ConfigServiceModuleFactoryOptions>
    | ConfigServiceModuleFactoryOptions;
  inject?: (InjectionToken | OptionalFactoryDependency)[];
}

export interface ConfigModuleAsyncFactory
  extends Pick<ModuleMetadata, 'imports'> {
  provide: InjectionToken;
  useFactory: (...args: any[]) => Promise<Config> | Config;
  inject?: (InjectionToken | OptionalFactoryDependency)[];
}
