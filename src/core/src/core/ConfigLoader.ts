import assert from 'assert';
import path from 'path';
import fs from 'fs';
import { ParsedUri } from './ParsedUri';

enum FileProtocol {
  FILE = 'file',
  S3 = 's3'
}

enum FileExtension {
  JSON = 'json'
}

export class ConfigLoader {
  private parsedUri: ParsedUri;

  constructor(fileLocationUri: string) {
    this.parsedUri = ConfigLoader.parseUri(fileLocationUri);

    assert(
      this.parsedUri.path,
      `Path of URI [${this.parsedUri.match}] is invalid.`
    );
  }

  /**
   * Asynchronously loads and validates the contents of the config file.
   * An error will be thrown if the validator fails or rejects the data.
   */
  public async load(): Promise<object> {
    const fileContents = await this.loadFileContentsByProtocol();

    const config = await this.parseFileContentsByExtension(fileContents);

    return config;
  }

  /**
   * Loads a ConfigLoader's file contents based on its .
   * @param parsedUri - Parsed URI from the ConfigLoader's config file location.
   */
  private async loadFileContentsByProtocol(): Promise<string> {
    const { protocol } = this.parsedUri;

    switch (protocol) {
      // file://*.*
      case FileProtocol.FILE:
        return this.loadFileProtocol();

      // s3://*.*
      case FileProtocol.S3:
      default:
        throw new Error(
          `URI protocol [${protocol}] is not supported}. Check that is equal to one of these values: ${Object.values(
            FileProtocol
          ).join(', ')}.`
        );
    }
  }

  /**
   * File protocol loader.
   * @param filePath - Path to the file to be loaded.
   */
  private loadFileProtocol(): string {
    return fs.readFileSync(this.parsedUri.path!).toString('utf-8'); // TODO: Find a way to resolve absolute and relative file paths...
  }

  private async parseFileContentsByExtension(
    fileContents: string
  ): Promise<object | object[]> {
    const ext = ConfigLoader.getFilePathExtension(this.parsedUri.path!);

    switch (ext) {
      case FileExtension.JSON:
        return ConfigLoader.parseJsonFile(fileContents);

      default:
        throw new Error(
          `URI file extension is not supported, received ${ext}. Check that is equal to ${Object.values(
            FileExtension
          ).join(', ')}.`
        );
    }
  }

  /**
   * Parses a string in JSON format.
   * @param fileContents - Path to the file to be loaded.
   */
  private static parseJsonFile(fileContents: string): object | object[] {
    return JSON.parse(fileContents);
  }

  /**
   * Returns the extention of the file path.
   * @param file - File path or name.
   */
  private static getFilePathExtension(file: string): string {
    const ext = path.extname(file).substring(1);
    return ext;
  }

  /**
   * Parses an URI string and returns a parsed URI object containing its components.
   * If the URI is invalid, an error is thrown.
   * @param uri - URI string.
   */
  private static parseUri(uri: string): ParsedUri {
    const parsedUri = new ParsedUri(uri);

    parsedUri.validateOrReject();

    return parsedUri;
  }
}
