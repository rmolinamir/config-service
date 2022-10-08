import 'reflect-metadata';
import { validateSync, IsString, IsOptional } from 'class-validator';

/**
 * Based on [URI Regular Expression](https://github.com/jhermsmeier/uri.regex).
 * By [Jonas Hermsmeier](https://github.com/jhermsmeier).
 */
export class ParsedUri {
  constructor(uri: string) {
    const matches = uri.match(ParsedUri.UriRegExp);

    if (!matches)
      throw new Error(
        `URI ${uri} is invalid. Check that the URI has a valid RFC3986 format.`
      );

    this.match = matches[0];
    this.protocol = matches[1];
    this.slashes = matches[2];
    this.authority = matches[3];
    this.host = matches[4];
    this.port = matches[5];
    this.path = matches[6] ?? matches[7] ?? matches[8];
    this.query = matches[9];
    this.hash = matches[10];
  }

  @IsString({
    message:
      '$property is invalid. Check that the URI has a valid RFC3986 format.'
  })
  public match: string;

  @IsString({
    message:
      '$property is invalid. Check that the URI has a valid RFC3986 format.'
  })
  public protocol: string;

  @IsOptional()
  @IsString({
    message:
      '$property is invalid. Check that the URI has a valid RFC3986 format.'
  })
  public slashes?: string;

  @IsOptional()
  @IsString({
    message:
      '$property is invalid. Check that the URI has a valid RFC3986 format.'
  })
  public authority?: string;

  @IsOptional()
  @IsString({
    message:
      '$property is invalid. Check that the URI has a valid RFC3986 format.'
  })
  public host?: string;

  @IsOptional()
  @IsString({
    message:
      '$property is invalid. Check that the URI has a valid RFC3986 format.'
  })
  public port?: string;

  @IsOptional()
  @IsString({
    message:
      '$property is invalid. Check that the URI has a valid RFC3986 format.'
  })
  public path?: string;

  @IsOptional()
  @IsString({
    message:
      '$property is invalid. Check that the URI has a valid RFC3986 format.'
  })
  public query?: string;

  @IsOptional()
  @IsString({
    message:
      '$property is invalid. Check that the URI has a valid RFC3986 format.'
  })
  public hash?: string;

  /**
   * Asynchronously validates the validator's data.
   */
  public validateOrReject(): void {
    const errors = validateSync(this);
    if (errors.length) throw errors;
  }

  // private static UriNamedGroupsRegExp =
  //   /^(?<scheme>[a-z][a-z0-9+.-]+):(?<authority>\/\/(?<user>[^@]+@)?(?<host>[a-z0-9.\-_~]+)(?<port>:\d+)?)?(?<path>(?:[a-z0-9-._~]|%[a-f0-9]|[!$&'()*+,;=:@])+(?:\/(?:[a-z0-9-._~]|%[a-f0-9]|[!$&'()*+,;=:@])*)*|(?:\/(?:[a-z0-9-._~]|%[a-f0-9]|[!$&'()*+,;=:@])+)*)?(?<query>\?(?:[a-z0-9-._~]|%[a-f0-9]|[!$&'()*+,;=:@]|[/?])+)?(?<fragment>#(?:[a-z0-9-._~]|%[a-f0-9]|[!$&'()*+,;=:@]|[/?])+)?$/i;

  private static UriRegExp =
    /([A-Za-z][A-Za-z0-9+\-.]*):(?:(\/\/)(?:((?:[A-Za-z0-9\-._~!$&'()*+,;=:]|%[0-9A-Fa-f]{2})*)@)?((?:\[(?:(?:(?:(?:[0-9A-Fa-f]{1,4}:){6}|::(?:[0-9A-Fa-f]{1,4}:){5}|(?:[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,1}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){3}|(?:(?:[0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){2}|(?:(?:[0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}:|(?:(?:[0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})?::)(?:[0-9A-Fa-f]{1,4}:[0-9A-Fa-f]{1,4}|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))|(?:(?:[0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})?::)|[Vv][0-9A-Fa-f]+\.[A-Za-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|(?:[A-Za-z0-9\-._~!$&'()*+,;=]|%[0-9A-Fa-f]{2})*))(?::([0-9]*))?((?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)|\/((?:(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)?)|((?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)|)(?:\?((?:[A-Za-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9A-Fa-f]{2})*))?(?:#((?:[A-Za-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9A-Fa-f]{2})*))?/;
}
