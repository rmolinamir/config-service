import type { Config } from './config.js';
import type { ExcludeFunctionsOf } from './types/exclude-functions-of.js';
import type { Maybe } from './types/maybe.js';

/**
 * Asynchronously transforms the data into a config object.
 */
export interface Transformer<C extends Config> {
  (ConfigClass: C, data: ExcludeFunctionsOf<Maybe<InstanceType<C>>>): Promise<
    InstanceType<C>
  >;
}
