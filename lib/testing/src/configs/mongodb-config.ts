import { ConfigService } from '@config-service/core';

@ConfigService.Register()
export class MongoDbConfig {
  public readonly uri!: string;
  public readonly dbName!: string;
}
