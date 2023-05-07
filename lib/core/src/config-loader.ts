import assert from 'assert';
import fs from 'fs';
import path from 'path';

import { Config } from './config';
import { ConfigModule } from './config-module';
import { Uri } from './uri';

enum FileProtocol {
  FILE = 'file'
}

enum FileExtension {
  JSON = 'json'
}

export class ConfigLoader<C extends Config> {
  private readonly source: Uri;

  private readonly module: ConfigModule<C>;

  constructor(source: string, module: ConfigModule<C>) {
    this.source = new Uri(source);
    this.module = module;

    assert(this.source.path, `URI {${this.source.match}} is invalid.`);
  }

  /**
   * Asynchronously loads the config file from the given source URI.
   */
  public async load(): Promise<InstanceType<C>> {
    let file: object;

    if (this.module.options.loader)
      file = await this.module.options.loader(
        this.module.Class,
        this.module.options
      );
    else file = await this.loadFile();

    let config: InstanceType<C>;

    if (this.module.options.transformer)
      config = await this.module.options.transformer(file);
    else {
      config = new this.module.Class() as InstanceType<C>;
      Object.assign(config, file);
    }

    if (this.module.options.validator)
      await this.module.options.validator(config);

    return config;
  }

  /**
   * Loads a file.
   */
  private async loadFile(): Promise<object> {
    let file: string;

    const { protocol } = this.source;

    switch (protocol) {
      // e.g.: file://*.*
      case FileProtocol.FILE: {
        file = ConfigLoader.fileProtocolHandler(this.source.path!);
        break;
      }

      default:
        throw new Error(`URI protocol {${protocol}} is not supported.`);
    }

    return this.parseFile(file);
  }

  private parseFile(fileContents: string): object {
    const ext = ConfigLoader.getPathExtension(this.source.path!);

    switch (ext) {
      case FileExtension.JSON:
        return ConfigLoader.parseJson(fileContents);

      default:
        throw new Error(
          `URI file extension is not supported, received {${ext}}. Check that is equal to ${Object.values(
            FileExtension
          ).join(', ')}.`
        );
    }
  }

  /**
   * File protocol loading handler.
   */
  private static fileProtocolHandler(path: string): string {
    return fs.readFileSync(path).toString('utf-8');
  }

  /**
   * Returns the extention of the file path.
   */
  private static getPathExtension(file: string): string {
    const ext = path.extname(file).substring(1);
    return ext;
  }

  /**
   * Parses a string in JSON format.
   */
  private static parseJson(json: string) {
    return JSON.parse(json);
  }
}
