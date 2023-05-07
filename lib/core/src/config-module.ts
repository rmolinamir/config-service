import { Config } from './config';
import { ConfigModuleState } from './config-module-state';
import { RegisterOptions } from './register-options';

export type ConfigModule<C extends Config> = {
  Class: C;
  state: ConfigModuleState;
  options: RegisterOptions<C>;
  config: InstanceType<C> | null;
};
