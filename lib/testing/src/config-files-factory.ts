import assert from 'assert';
import fs, { existsSync } from 'fs';
import os from 'os';
import path from 'path';

type ClassType = new (...args: unknown[]) => unknown;
type Uri = { value: string; path: string };
type ExcludeFunctions<Type> = Pick<
  Type,
  {
    [Key in keyof Type]: Type[Key] extends Function ? never : Key;
  }[keyof Type]
>;

export class ConfigFilesFactory {
  private files = new Map<ClassType, Uri>();

  constructor(private readonly location: string = os.tmpdir()) {
    assert(existsSync(this.location), 'Location does not exist.');
  }

  public add<C extends ClassType>(
    Config: C,
    data: ExcludeFunctions<InstanceType<C>>
  ): Uri {
    const file = path
      .resolve(this.location, `${Config.name}.json`)
      .replace(/\\/g, '/');

    fs.writeFileSync(file, JSON.stringify(data));

    const uri: Uri = {
      value: `file://${file}`,
      path: file
    };

    this.files.set(Config, uri);

    return uri;
  }

  public cleanup(): void {
    for (const file of this.files.values()) {
      try {
        fs.unlinkSync(file.path);
      } catch (err) {
        console.warn(`Could not delete file {${file.path}}: `, err);
      }
    }

    this.files.clear();
  }
}
