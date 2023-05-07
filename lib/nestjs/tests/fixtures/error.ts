import 'reflect-metadata';
import {
  ClassTransformerConfigTransformer,
  ClassValidatorConfigValidator,
  ConfigLoader,
  ConfigModule
} from '@config-service/core';
import path from 'path';

class ErrorTransformer extends ClassTransformerConfigTransformer {}

export const errorModule = new ConfigModule(
  'error',
  new ConfigLoader(
    `file://${path.resolve(__dirname, '.', 'error.json').replace(/\\/g, '/')}`
  ),
  new ErrorTransformer(),
  new ClassValidatorConfigValidator()
);
