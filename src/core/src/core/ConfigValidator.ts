export abstract class ConfigValidator {
  /**
   * Asynchronously validates the config data. If the data is invalid, it will return
   * a readable error.
   */
  public abstract validateOrReject<T extends object>(object: T): Promise<void>;

  /**
   * Synchronously validates the config data. If the data is invalid, it will return
   * a readable error.
   */
  public abstract validateOrRejectSync<T extends object>(object: T): void;
}
