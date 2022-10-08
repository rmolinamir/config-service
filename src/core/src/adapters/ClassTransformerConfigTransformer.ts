import 'reflect-metadata';
import { plainToClass, ClassTransformOptions } from 'class-transformer';
import { ClassType } from '../core/types';
import { ConfigTransformer } from '../core/ConfigTransformer';

export abstract class ClassTransformerConfigTransformer extends ConfigTransformer {
  public __transform(somethingToTransform: string | object | object[]): this {
    const loadedData = ClassTransformerConfigTransformer.transform(
      this.constructor as ClassType<this>,
      somethingToTransform
    );

    return loadedData;
  }

  /**
   * Synchronously converts JSON string to class (constructor) object.
   *
   * @param {ClassType<T>} classType The Class to parse and convert JSON to
   * @param {string | object | object[]} somethingToTransform The string containing JSON, object, or array of objects to instantiate and validate
   * @param {TransformOptions} [options] Optional options object for class-transformer
   * @returns {T} Object of given class T
   */
  private static transform<T extends object>(
    classType: ClassType<T>,
    somethingToTransform: string | object | object[],
    options?: ClassTransformOptions
  ): T {
    let object: object;

    if (typeof somethingToTransform === 'string') {
      object = JSON.parse(somethingToTransform);
    } else if (
      somethingToTransform != null &&
      typeof somethingToTransform === 'object'
    ) {
      object = somethingToTransform;
    } else {
      throw new Error(
        'Incorrect object param type! Only string, plain object and array of plain objects are valid.'
      );
    }

    const classObject = plainToClass(classType, object, options || undefined);

    return classObject;
  }
}
