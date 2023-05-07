import { Config } from './config';
import { ExcludeFunctionsOf } from './types/exclude-functions-of';
import { Maybe } from './types/maybe';

/**
 * Asynchronously transforms the data into a config object.
 */
export interface Transformer<C extends Config> {
  (data: ExcludeFunctionsOf<Maybe<InstanceType<C>>>): Promise<InstanceType<C>>;
}
