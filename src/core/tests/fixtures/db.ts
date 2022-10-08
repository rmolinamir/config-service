import 'reflect-metadata';
import { Matches } from 'class-validator';
import path from 'path';
import { ClassTransformerConfigTransformer } from '../../src/adapters/ClassTransformerConfigTransformer';
import { ClassValidatorConfigValidator } from '../../src/adapters/ClassValidatorConfigValidator';
import { ConfigLoader } from '../../src/core/ConfigLoader';
import { ConfigModule } from '../../src/core/ConfigModule';

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
