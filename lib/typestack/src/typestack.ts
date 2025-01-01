import { Config } from '@config-service/core/config';
import { RegisterOptions } from '@config-service/core/register-options';

import { TypeStackTransformer } from './typestack-transformer.js';
import { TypeStackValidator } from './typestack-validator.js';

export function TypeStack(
  options: Omit<RegisterOptions<Config>, 'transformer' | 'validator'> = {},
  transformer: ReturnType<typeof TypeStackTransformer> = TypeStackTransformer(),
  validator: ReturnType<typeof TypeStackValidator> = TypeStackValidator()
): RegisterOptions<Config> {
  return {
    ...options,
    transformer,
    validator
  };
}
