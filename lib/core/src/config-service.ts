import assert from 'assert';
import { Config } from './config';
import { ConfigLoader } from './config-loader';
import { ConfigModule } from './config-module';
import { ConfigModuleState } from './config-module-state';
import { RegisterOptions } from './register-options';
import { ClassDecorator as NewClassDecorator } from './types/class-decorator';
import { ClassConstructor } from './types/class-type';

export class ConfigService {
  constructor(public readonly loader: ConfigLoader) {}

  /**
   * Get the config instance for the given Config class.
   */
  public get<C extends Config>(Config: C): InstanceType<C> {
    const module = this.module(Config);

    if (!module)
      throw new Error(
        `Config {${Config.name}} not found. Make sure to register the Config class with the Register decorator.`
      );
    else if (module.state !== ConfigModuleState.LOADED)
      throw new Error(`Config {${Config.name}} is not loaded.`);
    else if (!module.config)
      throw new Error(`Config {${Config.name}} is null.`);

    return module.config;
  }

  /**
   * Load the config data for the given Config class.
   */
  public async load<C extends Config>(
    Config: C,
    source: string
  ): Promise<void> {
    const module = this.module(Config);

    if (!module)
      throw new Error(
        `Config {${Config.name}} not found. Make sure to register the Config class with the Register decorator.`
      );
    else if (module.state === ConfigModuleState.UNLOADED) {
      const file = await this.loader.load(source);

      if (module.options.transformer) {
        module.config = await module.options.transformer(module.Class, file);
        assert(
          Object.getPrototypeOf(module.config).constructor === module.Class,
          'The transformer must return an instance of the config class.'
        );
      } else {
        module.config = new module.Class() as InstanceType<C>;
        Object.assign(module.config, file);
      }

      if (module.options.validator)
        await module.options.validator(module.config);

      module.state = ConfigModuleState.LOADED;
    }
  }

  private module<C extends Config>(Config: C): ConfigModule<C> | undefined {
    return ConfigService.configModules.get(Config) as
      | ConfigModule<C>
      | undefined;
  }

  /**
   * This decorator is used to register a Config class with the ConfigService.
   * The ConfigService will use this class to load the config data.
   */
  public static Register<ConfigType extends InstanceType<Config>>(
    options: RegisterOptions<ClassConstructor<ConfigType>> = {}
  ) {
    const decorator: NewClassDecorator = (Class, context) => {
      if (!options?.override && ConfigService.configModules.has(Class))
        throw new Error(`Config {${context.name}} already registered.`);

      const module: ConfigModule<ClassConstructor<ConfigType>> = {
        Class: Class as ClassConstructor<ConfigType>,
        state: ConfigModuleState.UNLOADED,
        options,
        config: null
      };

      this.configModules.set(
        module.Class,
        module as unknown as ConfigModule<Config>
      );

      return Class;
    };

    return decorator as ClassDecorator;
  }

  private static configModules = new Map<Config, ConfigModule<Config>>();
}
