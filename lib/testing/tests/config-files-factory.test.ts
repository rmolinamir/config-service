import { Uri } from '@config-service/core/uri';
import { faker } from '@faker-js/faker';
import { existsSync } from 'fs';

import {
  ConfigFilesFactory,
  JwtConfig,
  MongoDbConfig,
  RedisConfig,
  ServerConfig
} from '../src';

describe('ConfigFilesFactory', () => {
  const factory = new ConfigFilesFactory();

  const jwtData: JwtConfig = {
    secret: faker.random.alphaNumeric(32),
    expiresIn: '1h'
  };

  const mongoDbData: MongoDbConfig = {
    uri: faker.internet.url(),
    dbName: faker.random.alphaNumeric(10)
  };

  const redisData: RedisConfig = {
    host: faker.internet.ip(),
    port: faker.datatype.number(),
    password: faker.random.alphaNumeric(32),
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
    const location = factory.add(JwtConfig, jwtData);
    const uri = new Uri(location);

    expect(existsSync(uri.path!)).toBe(true);

    expect(() => factory.cleanup()).not.toThrow();

    expect(existsSync(uri.path!)).toBe(false);
  });
});
