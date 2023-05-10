import { ConfigService } from '@config-service/core';

@ConfigService.Register()
export class ServerConfig {
  public readonly host!: string;
  public readonly port!: number;
}
