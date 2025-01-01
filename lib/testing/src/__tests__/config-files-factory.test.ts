import { existsSync } from 'fs';
import { describe, expect, test } from 'vitest';
import { faker } from '@faker-js/faker';
import { ConfigFilesFactory } from '..';
import { JwtConfig } from './configs/jwt-config';
import { MongoDbConfig } from './configs/mongodb-config';
import { RedisConfig } from './configs/redis-config';
import { ServerConfig } from './configs/server-config';

describe('ConfigFilesFactory', () => {
  const factory = new ConfigFilesFactory();

  const jwtData: JwtConfig = {
    secret: faker.string.alphanumeric(32),
    expiresIn: '1h'
  };

  const mongoDbData: MongoDbConfig = {
    uri: faker.internet.url(),
    dbName: faker.string.alphanumeric(10)
  };

  const redisData: RedisConfig = {
    host: faker.internet.ip(),
    port: faker.datatype.number(),
    password: faker.string.alphanumeric(32),
    db: faker.datatype.number()
  };

  const serverConfigData: ServerConfig = {
    host: faker.internet.ip(),
    port: faker.datatype.number()
  };

  test('add', async () => {
    expect(() => factory.add(JwtConfig, jwtData)).not.toThrow();
    expect(() => factory.add(MongoDbConfig, mongoDbData)).not.toThrow();
    expect(() => factory.add(RedisConfig, redisData)).not.toThrow();
    expect(() => factory.add(ServerConfig, serverConfigData)).not.toThrow();
  });

  test('cleanup', async () => {
    const uri = factory.add(JwtConfig, jwtData);

    expect(existsSync(uri.path!)).toBe(true);

    expect(() => factory.cleanup()).not.toThrow();

    expect(existsSync(uri.path!)).toBe(false);
  });
});
