import type { Config } from '@config-service/core/config';
import type { Transformer } from '@config-service/core/transformer';
import type { ClassTransformOptions } from 'class-transformer';
import { plainToInstance } from 'class-transformer';

export function TypeStackTransformer(
  options?: ClassTransformOptions
): Transformer<Config> {
  return async function (ConfigClass: Config, data: object) {
    let object: object;

    if (typeof data === 'string') {
      object = JSON.parse(data);
    } else if (data != null && typeof data === 'object') {
      object = data;
    } else {
      throw new Error(
        'Incorrect object param type! Only string, plain object and array of plain objects are valid.'
      );
    }

    const classObject = plainToInstance(ConfigClass, object, options);

    return classObject as InstanceType<Config>;
  };
}
