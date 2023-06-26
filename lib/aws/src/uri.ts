/**
 * Based on [URI Regular Expression](https://github.com/jhermsmeier/uri.regex).
 */
export class Uri {
  constructor(uri: string) {
    const matches = uri.match(Uri.RegExp);

    if (!matches)
      throw new Error(
        `URI {${uri}} is invalid. Check that the URI has a valid RFC3986 format.`
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

    this.validate();
  }

  private match: string;

  public protocol: string;

  public slashes?: string;

  public authority?: string;

  public host?: string;

  public port?: string;

  public path?: string;

  public query?: string;

  public hash?: string;

  public toString(): string {
    return this.match;
  }

  private validate(): void {
    const errors: string[] = [];

    if (!this.protocol)
      errors.push(
        `URI protocol {${this.protocol}} is invalid. Check that the URI has a valid RFC3986 format.`
      );

    if (errors.length > 0) throw new Error(errors.join('\n'));
  }

  private static RegExp =
    /([A-Za-z][A-Za-z0-9+\-.]*):(?:(\/\/)(?:((?:[A-Za-z0-9\-._~!$&'()*+,;=:]|%[0-9A-Fa-f]{2})*)@)?((?:\[(?:(?:(?:(?:[0-9A-Fa-f]{1,4}:){6}|::(?:[0-9A-Fa-f]{1,4}:){5}|(?:[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,1}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){3}|(?:(?:[0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){2}|(?:(?:[0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}:|(?:(?:[0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})?::)(?:[0-9A-Fa-f]{1,4}:[0-9A-Fa-f]{1,4}|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))|(?:(?:[0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})?::)|[Vv][0-9A-Fa-f]+\.[A-Za-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|(?:[A-Za-z0-9\-._~!$&'()*+,;=]|%[0-9A-Fa-f]{2})*))(?::([0-9]*))?((?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)|\/((?:(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)?)|((?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)|)(?:\?((?:[A-Za-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9A-Fa-f]{2})*))?(?:#((?:[A-Za-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9A-Fa-f]{2})*))?/;
}
