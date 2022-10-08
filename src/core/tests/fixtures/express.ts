import 'reflect-metadata';
import { IsString } from 'class-validator';
import path from 'path';
import { ClassTransformerConfigTransformer } from '../../src/adapters/ClassTransformerConfigTransformer';
import { ClassValidatorConfigValidator } from '../../src/adapters/ClassValidatorConfigValidator';
import { ConfigLoader } from '../../src/core/ConfigLoader';
import { ConfigModule } from '../../src/core/ConfigModule';

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
