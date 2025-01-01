import type { Config } from './config.js';
import { ConfigModuleState } from './config-module-state.js';
import type { RegisterOptions } from './register-options.js';

export type ConfigModule<C extends Config> = {
  Class: C;
  state: ConfigModuleState;
  options: RegisterOptions<C>;
  config: InstanceType<C> | null;
};
