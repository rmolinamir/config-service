import fs from 'fs';
import os from 'os';
import path from 'path';

import type { Config } from '../config.js';
import type { ExcludeFunctionsOf } from '../types/exclude-functions-of.js';
import { Uri } from '../uri.js';

export class ConfigFilesFactory {
  private files = new Map<Config, Uri>();

  public add<C extends Config>(
    Config: C,
    data: ExcludeFunctionsOf<InstanceType<C>>
  ): string {
    const uri = new Uri(
      `file://${path
        .resolve(os.tmpdir(), `${Config.name}.json`)
        .replace(/\\/g, '/')}`
    );

    fs.writeFileSync(uri.path!, JSON.stringify(data));

    this.files.set(Config, uri);

    return uri.toString();
  }

  public cleanup(): void {
    for (const file of this.files.values()) {
      try {
        fs.unlinkSync(file.path!);
      } catch (err) {
        console.error((err as Error).message);
      }
    }

    this.files.clear();
  }
}
