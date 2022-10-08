import { ConfigService } from '../src/ConfigService';
import { dbConnectionStringModule } from './fixtures/db';
import { expressModule } from './fixtures/express';
import { redisModule } from './fixtures/redis';
import { nestedModule } from './fixtures/nested';
import { nestedArrayModule } from './fixtures/nestedArray';

describe('ConfigService', () => {
  const config = new ConfigService(
    dbConnectionStringModule,
    expressModule,
    redisModule,
    nestedModule,
    nestedArrayModule
  );

  test('linting', async () => {
    await config.load();
    expect(config.modules.db).toBeTruthy();
    expect(config.modules.db.dbConnectionString).toBeTruthy();
    expect(config.modules.express).toBeTruthy();
    expect(config.modules.express.sessionSecretKey).toBeTruthy();
    expect(config.modules.redis).toBeTruthy();
    expect(config.modules.nested).toBeTruthy();
    expect(config.modules.nestedArray).toBeTruthy();
    expect(config.modules.nested.foo.bar.baz).toBeTruthy();
    expect(typeof config.modules.nested.foo.bar.baz === 'string').toBeTruthy();
  });
});
