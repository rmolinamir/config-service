import { Type } from 'class-transformer';
import {
  IsString,
  IsDefined,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
  IsArray,
  ArrayMinSize
} from 'class-validator';
import path from 'path';
import { ClassTransformerConfigTransformer } from '../../src/adapters/ClassTransformerConfigTransformer';
import { ClassValidatorConfigValidator } from '../../src/adapters/ClassValidatorConfigValidator';
import { ConfigLoader } from '../../src/core/ConfigLoader';
import { ConfigModule } from '../../src/core/ConfigModule';

class Bar {
  @IsString()
  public foobar!: string;
}

class Foo {
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => Bar)
  public bar!: Bar;

  @IsString()
  public baz!: string;
}

export class NestedArrayTransformer extends ClassTransformerConfigTransformer {
  @IsDefined()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => Foo)
  public foo!: Foo[];
}

export const nestedArrayModule = new ConfigModule(
  'nestedArray',
  new ConfigLoader(
    `file://${path
      .resolve(__dirname, '.', 'nestedArray.json')
      .replace(/\\/g, '/')}`
  ),
  new NestedArrayTransformer(),
  new ClassValidatorConfigValidator()
);
