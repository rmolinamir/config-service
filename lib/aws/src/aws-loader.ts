import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigLoader } from '@config-service/core';
import assert from 'assert';
import path from 'path';

import { FileExtension } from './file-extension';
import { Uri } from './uri';

/**
 * TODOs:
 *
 * - [ ] Add support for other AWS services such as Secrets Manager, Parameter
 *       Store, AppConfig, etc.
 * - [ ] Add TTL option to cache config files, if the TTL is expired, the file
 *       will be reloaded.
 * - [ ] Instead of TTL, we can use the ETag header to check if the file has
 *       changed. But we would have to always do a HEAD request to get the ETag.
 */
export class AwsLoader implements ConfigLoader {
  constructor(private readonly s3Client: S3Client) {}

  /**
   * Asynchronously loads the config file from the given source URI.
   */
  public async load(source: string): Promise<object> {
    const uri = new Uri(source);

    assert(
      uri.path,
      `URIs without paths are not supported, received {${uri.toString()}}.`
    );

    return this.loadFile(uri);
  }

  private async loadFile(uri: Uri): Promise<object> {
    const bucket = uri.host!;
    const key = uri.path!.startsWith('/') ? uri.path!.substring(1) : uri.path;

    const res = await this.s3Client.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key
      })
    );

    const file = await res.Body?.transformToString();

    assert(file, `File {${uri.toString()}} is empty.`);

    return this.parseFile(uri, file);
  }

  private parseFile(uri: Uri, fileContents: string): object {
    const ext = AwsLoader.getFileExtension(uri.path!);

    switch (ext) {
      case FileExtension.JSON:
        return AwsLoader.parseJson(fileContents);

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
