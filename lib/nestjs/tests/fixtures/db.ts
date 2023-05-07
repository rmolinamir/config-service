import 'reflect-metadata';
import {
  ClassTransformerConfigTransformer,
  ClassValidatorConfigValidator,
  ConfigLoader,
  ConfigModule
} from '@config-service/core';
import { Matches } from 'class-validator';
import path from 'path';

class DbConnectionStringTransformer extends ClassTransformerConfigTransformer {
  @Matches(/^mongodb:\/\/.*$/i)
  public dbConnectionString!: string;
}

export const dbConnectionStringModule = new ConfigModule(
  'db',
  new ConfigLoader(
    `file://${path.resolve(__dirname, '.', 'db.json').replace(/\\/g, '/')}`
  ),
  new DbConnectionStringTransformer(),
  new ClassValidatorConfigValidator()
);
