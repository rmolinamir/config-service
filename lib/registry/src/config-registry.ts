import { Config } from '@config-service/core/config';
import { Uri } from '@config-service/core/uri';
import assert from 'assert';
import { existsSync } from 'fs';
import { resolve } from 'path';

export class ConfigRegistry {
  private readonly filenames = new Map<Config, string>();

  constructor(private readonly options: { location: string }) {
    assert(existsSync(options.location), 'Location does not exist.');
  }

  /**
   * Register a config with a filename.
   */
  public register(config: Config, filename: string): void {
    this.filenames.set(config, filename);
  }

  /**
   * Returns the location of a config.
   */
  public location(config: Config): string {
    const filename = this.filenames.get(config);

    assert(filename, 'Config is not registered.');

    const location = resolve(this.options.location, filename);

    assert(existsSync(location), 'Location does not exist.');

    return new Uri(`file://${location}`).toString();
  }
}
