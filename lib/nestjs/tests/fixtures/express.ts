import 'reflect-metadata';
import {
  ClassTransformerConfigTransformer,
  ClassValidatorConfigValidator,
  ConfigLoader,
  ConfigModule
} from '@config-service/core';
import { IsString } from 'class-validator';
import path from 'path';

class ExpressTransformer extends ClassTransformerConfigTransformer {
  @IsString()
  public sessionSecretKey!: string;
}

export const expressModule = new ConfigModule(
  'express',
  new ConfigLoader(
    `file://${path.resolve(__dirname, '.', 'express.json').replace(/\\/g, '/')}`
  ),
  new ExpressTransformer(),
  new ClassValidatorConfigValidator()
);
