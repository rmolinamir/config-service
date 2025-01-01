import { ConfigService } from '@config-service/core';

@ConfigService.Register()
export class RedisConfig {
  public readonly host!: string;
  public readonly port!: number;
  public readonly password!: string;
  public readonly db!: number;
}
