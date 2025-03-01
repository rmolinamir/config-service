import assert from 'assert';
import fs from 'fs';
import path from 'path';

import { ConfigLoader } from './config-loader.js';
import { FileExtension } from './file-extension.js';
import { Uri } from './uri.js';

export class FileLoader implements ConfigLoader {
  /**
   * Sets up the config module from the given source URI.
   */
  public async load(source: string): Promise<object> {
    const uri = new Uri(source);

    assert(
      uri.path,
      `URIs without paths are not supported, received {${uri.toString()}}.`
    );

    const isRelative = uri.host === '.';

    const filePath = isRelative ? path.resolve(process.cwd(), `./${uri.path}`) : uri.path;

    const buffer = await fs.promises.readFile(filePath);
    return this.parseFile(uri, buffer.toString('utf-8'));
  }

  private parseFile(uri: Uri, fileContents: string): object {
    const ext = FileLoader.getFileExtension(uri.path!);

    switch (ext) {
      case FileExtension.JSON:
        return FileLoader.parseJson(fileContents);

      default:
        throw new Error(
          `URI file extension is not supported, received {${ext}}. Check that is equal to ${Object.values(
            FileExtension
          ).join(', ')}.`
        );
    }
  }

  /**
   * Returns the extention of the file.
   */
  private static getFileExtension(file: string): string {
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
