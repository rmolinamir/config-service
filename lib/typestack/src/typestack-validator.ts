import { Validator } from '@config-service/core';
import {
  validateSync,
  ValidationError,
  ValidatorOptions
} from 'class-validator';

import type { Config } from '@config-service/core/config';

export function TypeStackValidator(
  options?: ValidatorOptions
): Validator<Config> {
  return async function (config: InstanceType<Config>) {
    let errors: ValidationError[];

    if (Array.isArray(config)) {
      errors = config
        .map((configElement) => validateSync(configElement, options))
        .flat();
    } else {
      errors = validateSync(config, options);
    }

    if (errors.length)
      throw new Error(errors.map((e) => e.toString()).join('\n'), {
        cause: errors
      });
  };
}
