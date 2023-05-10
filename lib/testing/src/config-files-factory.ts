import { Config } from '@config-service/core/config';
import { ExcludeFunctionsOf } from '@config-service/core/types/exclude-functions-of';
import { Uri } from '@config-service/core/uri';
import assert from 'assert';
import fs, { existsSync } from 'fs';
import os from 'os';
import path from 'path';

export class ConfigFilesFactory {
  private files = new Map<Config, Uri>();

  constructor(private readonly location: string = os.tmpdir()) {
    assert(existsSync(this.location), 'Location does not exist.');
  }

  public add<C extends Config>(
    Config: C,
    data: ExcludeFunctionsOf<InstanceType<C>>
  ): string {
    const uri = new Uri(
      `file://${path
        .resolve(this.location, `${Config.name}.json`)
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
