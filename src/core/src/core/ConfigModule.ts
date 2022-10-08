import { ConfigLoader } from './ConfigLoader';
import { ConfigTransformer } from './ConfigTransformer';
import { ConfigValidator } from './ConfigValidator';

export class ConfigModule<
  Transformer extends ConfigTransformer = ConfigTransformer,
  Key extends string = string
> {
  constructor(
    /**
     * Index name of the file contents used as an index key by the config
     * object.
     */
    public readonly key: Key,
    public loader: ConfigLoader,
    public transformer: Transformer,
    public validator: ConfigValidator
  ) {}

  /**
   * Asynchronously loads and validates the Transformer and stores it
   * in the module property.
   * An error will be thrown if any of the modules fail or reject their data.
   */
  public async load(): Promise<Transformer> {
    const loadedData = await this.loader.load();

    const transformedData = this.transformer.__transform(loadedData);

    this.validator.validateOrRejectSync(transformedData);

    return transformedData;
  }
}
