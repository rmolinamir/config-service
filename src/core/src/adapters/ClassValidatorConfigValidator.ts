import 'reflect-metadata';
import {
  validate,
  validateSync,
  validateOrReject,
  ValidationError,
  ValidatorOptions
} from 'class-validator';
import { ConfigValidator } from '../core/ConfigValidator';

export class ClassValidatorConfigValidator extends ConfigValidator {
  /**
   * Asynchronously validates the config data. If the data is invalid, it will return
   * a readable error.
   */
  public async validateOrReject<T extends object>(object: T): Promise<void> {
    try {
      await ClassValidatorConfigValidator.validate(object);
    } catch (error) {
      throw new Error((error as ValidationError).toString(true));
    }
  }

  public validateOrRejectSync<T extends object>(object: T): void {
    try {
      ClassValidatorConfigValidator.validateSync(object);
    } catch (error) {
      throw new Error((error as ValidationError).toString(true));
    }
  }

  /**
   * Asynchronously validates object.
   * Reject the promise if the object doesn't pass validation.
   *
   * @param {ClassType<T>} object The object to validate.
   * @param {ValidatorOptions} [options] Optional options object for class-validator.
   * @returns {Promise<T|T[]>} Promise of object of given class T or array of objects given class T.
   */
  private static validate<T extends object>(
    object: T,
    options?: ValidatorOptions
  ): Promise<T | T[]> {
    return new Promise((resolve, reject) => {
      if (Array.isArray(object)) {
        Promise.all(
          object.map((objectElement) =>
            validate(objectElement, options || undefined)
          )
        ).then((errors) =>
          errors.every((error) => error.length === 0)
            ? resolve(object)
            : reject(errors)
        );
      } else {
        validateOrReject(object, options || undefined)
          .then(() => resolve(object))
          .catch(reject);
      }
    });
  }

  /**
   * Synchronously validates object.
   * Throws error if the object doesn't pass validation.
   *
   * @param {ClassType<T>} object The object to validate.
   * @param {ValidatorOptions} [options] Optional options object for class-validator.
   * @returns {T|T[]} Object of given class T or array of objects given class T.
   */
  private static validateSync<T extends object>(
    object: T,
    options?: ValidatorOptions
  ): T | T[] {
    if (Array.isArray(object)) {
      const errorsArray = object.map((objectElement) =>
        validateSync(objectElement, options || undefined)
      );

      if (errorsArray.some((errors) => errors.length !== 0)) throw errorsArray;

      return object;
    } else {
      const errors = validateSync(object, options || undefined);

      if (errors.length) throw errors;

      return object;
    }
  }
}
