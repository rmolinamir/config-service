import { ConfigModule } from './core/ConfigModule';
import { TransformersByKey } from './core/types';

export class ConfigService<T extends ConfigModule[]> {
  public modules: TransformersByKey<T> = {} as TransformersByKey<T>;

  private __modules: T;

  constructor(...modules: T) {
    this.__modules = modules;
  }

  /**
   * Asynchronously loads and validates all ConfigLoaders.
   * An error will be thrown if any of the modules fail or reject their data.
   */
  public async load(): Promise<void> {
    const promises = this.__modules.map(async (module) => {
      const data = await module.load();

      const key = module.key as keyof TransformersByKey<T>;

      const alreadyExists = this.modules[key];

      if (alreadyExists)
        throw new Error(
          `A duplicated config index key "[${key}]" was found. Check that your index keys are unique.`
        );

      Object.assign(this.modules, { [key]: data });
    });

    await Promise.all(promises);
  }
}
