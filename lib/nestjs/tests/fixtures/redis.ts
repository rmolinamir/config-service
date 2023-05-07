import {
  ClassTransformerConfigTransformer,
  ClassValidatorConfigValidator,
  ConfigLoader,
  ConfigModule
} from '@config-service/core';
import { IsInt, IsString, IsEnum } from 'class-validator';
import path from 'path';

enum RedisFamily {
  IPv4 = 4,
  IPv6 = 6
}

class RedisTransformer extends ClassTransformerConfigTransformer {
  @IsInt()
  public port!: number;

  @IsString()
  public host!: string;

  @IsEnum(RedisFamily)
  public family!: number;

  @IsString()
  public password!: string;

  @IsInt()
  public db!: number;
}

export const redisModule = new ConfigModule(
  'redis',
  new ConfigLoader(
    `file://${path.resolve(__dirname, '.', 'redis.json').replace(/\\/g, '/')}`
  ),
  new RedisTransformer(),
  new ClassValidatorConfigValidator()
);
