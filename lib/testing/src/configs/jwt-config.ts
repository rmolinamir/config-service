import { ConfigService } from '@config-service/core';

@ConfigService.Register()
export class JwtConfig {
  public readonly secret!: string;
  public readonly expiresIn!: string;
}
