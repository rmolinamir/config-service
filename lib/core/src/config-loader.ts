export abstract class ConfigLoader {
  /**
   * Loads a resource from a given URI.
   */
  public abstract load(source: string): Promise<object>;
}
