/* eslint-disable @typescript-eslint/no-explicit-any */

import { plainToInstance } from 'class-transformer';
import type {
  ValidationOptions
} from 'class-validator';
import {
  registerDecorator,
  validateSync,
} from 'class-validator';

export function IsType(Class: new () => any, options: ValidationOptions = {}) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsType',
      target: object.constructor,
      propertyName,
      constraints: [],
      options,
      validator: {
        validate(value: unknown) {
          if (!value) return false;
          return validateSync(plainToInstance(Class, value)).length === 0;
        }
      }
    });
  };
}
