import fs from 'fs';
import os from 'os';
import path from 'path';

import { Config } from '../../src/config';
import { ExcludeFunctionsOf } from '../../src/types/exclude-functions-of';

export class ConfigFiles {
  private testSuiteFiles = new Map<Config, string>();

  public add<C extends Config>(
    Config: C,
    data: ExcludeFunctionsOf<InstanceType<C>>
  ): string {
    const filepath = path
      .resolve(os.tmpdir(), `${Config.name}.json`)
      .replace(/\\/g, '/');

    fs.writeFileSync(filepath, JSON.stringify(data));

    this.testSuiteFiles.set(Config, filepath);

    return `file://${filepath}`;
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
