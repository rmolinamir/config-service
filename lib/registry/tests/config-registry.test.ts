import { ConfigService } from '@config-service/core';
import { ConfigFilesFactory, JwtConfig } from '@config-service/testing';
import { faker } from '@faker-js/faker';
import os from 'os';
import path from 'path';

import { ConfigRegistry } from '../src';

describe('ConfigRegistry', () => {
  const tmpDir = os.tmpdir();

  const factory = new ConfigFilesFactory(tmpDir);
  const service = new ConfigService();

  const jwtData: JwtConfig = {
    secret: faker.random.alphaNumeric(32),
    expiresIn: '1h'
  };

  test('instance', async () => {
    const registry = new ConfigRegistry({ location: tmpDir });

    registry.register(
      JwtConfig,
      path.basename(factory.add(JwtConfig, jwtData))
    );

    const jwtLocation = registry.location(JwtConfig);

    await service.load(JwtConfig, jwtLocation);

    expect(service.get(JwtConfig)).toMatchObject(jwtData);
  });
});
