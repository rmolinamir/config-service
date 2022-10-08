import 'reflect-metadata';
import { Type } from 'class-transformer';
import {
  IsString,
  IsDefined,
  IsNotEmptyObject,
  IsObject,
  ValidateNested
} from 'class-validator';
import path from 'path';
import { ClassTransformerConfigTransformer } from '../../src/adapters/ClassTransformerConfigTransformer';
import { ClassValidatorConfigValidator } from '../../src/adapters/ClassValidatorConfigValidator';
import { ConfigLoader } from '../../src/core/ConfigLoader';
import { ConfigModule } from '../../src/core/ConfigModule';

class Baz {
  @IsString()
  public baz!: string;
}

class Bar {
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Baz)
  public bar!: Baz;
}

class NestedTransformer extends ClassTransformerConfigTransformer {
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Bar)
  public foo!: Bar;
}

export const nestedModule = new ConfigModule(
  'nested',
  new ConfigLoader(
    `file://${path.resolve(__dirname, '.', 'nested.json').replace(/\\/g, '/')}`
  ),
  new NestedTransformer(),
  new ClassValidatorConfigValidator()
);
