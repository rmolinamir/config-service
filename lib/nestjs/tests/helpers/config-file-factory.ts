import { Config } from '@config-service/core/config';
import { ExcludeFunctionsOf } from '@config-service/core/types/exclude-functions-of';
import fs from 'fs';
import os from 'os';
import path from 'path';

export class ConfigFilesFactory {
  private files = new Map<Config, string>();

  public add<C extends Config>(
    Config: C,
    data: ExcludeFunctionsOf<InstanceType<C>>
  ): string {
    const filepath = path
      .resolve(os.tmpdir(), `${Config.name}.json`)
      .replace(/\\/g, '/');

    fs.writeFileSync(filepath, JSON.stringify(data));

    this.files.set(Config, filepath);

    return `file://${filepath}`;
  }

  public cleanup(): void {
    for (const file of this.files.values()) {
      try {
        fs.unlinkSync(file);
      } catch (err) {
        console.error((err as Error).message);
      }
    }

    this.files.clear();
  }
}
