import { Config } from './config';
import { RegisterOptions } from './register-options';

/**
 * Asynchronously transforms the given parameter into a config object.
 */
export interface Loader<C extends Config> {
  (ConfigClass: C, options: RegisterOptions<C>): Promise<InstanceType<C>>;
}
