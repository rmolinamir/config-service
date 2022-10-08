import { ConfigModule } from '@config-service/core';
import {
  InjectionToken,
  ModuleMetadata,
  OptionalFactoryDependency
} from '@nestjs/common';

export interface ConfigModuleAsyncFactory
  extends Pick<ModuleMetadata, 'imports'> {
  provide: InjectionToken;
  useFactory: (...args: unknown[]) => Promise<ConfigModule> | ConfigModule;
  inject?: (InjectionToken | OptionalFactoryDependency)[];
}
