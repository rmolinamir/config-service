import fs from 'fs';
import os from 'os';
import path from 'path';

import { Config } from '../../src/config';
import { ExcludeFunctionsOf } from '../../src/types/exclude-functions-of';

export class ConfigFiles {
  private testSuiteFiles = new Map<Config, string>();

  public path<C extends Config>(Config: C): string {
    const path = this.testSuiteFiles.get(Config);

    if (!path) throw new Error(`Config {${Config.name}} path not found.`);

    return `file://${path}`;
  }

  public add<C extends Config>(
    Config: C,
    data: ExcludeFunctionsOf<InstanceType<C>>
  ): void {
    const filepath = path
      .resolve(os.tmpdir(), `${Config.name}.json`)
      .replace(/\\/g, '/');

    fs.writeFileSync(filepath, JSON.stringify(data));

    this.testSuiteFiles.set(Config, filepath);
  }

  public cleanup(): void {
    for (const file of this.testSuiteFiles.values()) {
      try {
        fs.unlinkSync(file);
      } catch (err) {
        console.error((err as Error).message);
      }
    }

    this.testSuiteFiles.clear();
  }
}
