import type { Config } from './config.js';

/**
 * Asynchronously validates the config data. If the data is invalid, it will return a readable error.
 */
export interface Validator<C extends Config> {
  (config: InstanceType<C>): Promise<void>;
}
