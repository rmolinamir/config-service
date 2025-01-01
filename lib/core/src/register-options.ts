import type { Config } from './config.js';
import type { Transformer } from './transformer.js';
import type { Validator } from './validator.js';

export type RegisterOptions<C extends Config> = {
  /**
   * If true, the config will be registered even if it is already registered.
   * @default false
   */
  override?: boolean;

  /**
   * Transforms the loaded data into an object that matches the config type excluding functions.
   * @default undefined
   * @example
   * transformer: (data) => ({ foo: data.bar }})
   */
  transformer?: Transformer<C>;

  /**
   * Validates the config object.
   * @default undefined
   * @example
   * validator: (config) => {
   *  if (!config.foo) throw new Error('Config is invalid.');
   * }
   */
  validator?: Validator<C>;
};
