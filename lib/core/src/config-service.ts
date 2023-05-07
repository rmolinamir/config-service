import { Config } from './config';
import { ConfigLoader } from './config-loader';
import { ConfigModule } from './config-module';
import { ConfigModuleState } from './config-module-state';
import { RegisterOptions } from './register-options';
import { ClassDecorator as NewClassDecorator } from './types/class-decorator';
import { ClassConstructor } from './types/class-type';

export class ConfigService {
  public get<C extends Config>(Config: C): InstanceType<C> {
    const module = this.module(Config);

    if (!module) throw new Error(`Config {${Config.name}} not found.`);
    else if (module.state !== ConfigModuleState.LOADED)
      throw new Error(`Config {${Config.name}} is not loaded.`);
    else if (!module.config)
      throw new Error(`Config {${Config.name}} is null.`);

    return module.config;
  }

  public async load<C extends Config>(
    Config: C,
    source: string
  ): Promise<void> {
    const module = this.module(Config);

    if (!module) throw new Error(`Config {${Config.name}} not found.`);
    else if (module.state === ConfigModuleState.UNLOADED) {
      const loader = new ConfigLoader(source, module);

      module.config = await loader.load();

      module.state = ConfigModuleState.LOADED;
    }
  }

  public module<C extends Config>(Config: C): ConfigModule<C> | undefined {
    return ConfigService.configModules.get(Config) as
      | ConfigModule<C>
      | undefined;
  }

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
