import assert from 'assert';
import path from 'path';

import { ConfigModule, ConfigTransformer } from '../core-v2/src';

export type RegistryEnvironment = 'prod' | 'dev' | 'test';

export default class ConfigRegistry {
  private static registry: ConfigRegistry;

  private filepaths: Map<
    typeof ConfigModule<ConfigTransformer>,
    Map<RegistryEnvironment, string>
  > = new Map();

  private constructor() {}

  /**
   * Registers the ConfigModule in the registry and its config file.
   *
   * TODOs:
   *  - Decouple this from the ConfigModules.
   *  - Add this as part of the `@config-service/nestjs` or something similar.
   */
  public static Register<Module extends typeof ConfigModule>(
    filename: string,
    onEnvironments: Iterable<RegistryEnvironment>
  ): ClassDecorator {
    return function (Class: Module) {
      for (const env of onEnvironments)
        ConfigRegistry.set(Class, env, filename);
    } as ClassDecorator;
  }

  /**
   * Returns an instance of a ConfigModule subclass that depends only on its configuration file path.
   */
  public static new<Module extends ConfigModule<ConfigTransformer>>(
    ConfigModule: new (filename: string) => Module,
    env = (process.env.NODE_ENV || 'dev') as RegistryEnvironment
  ): Module {
    assert(
      ['prod', 'dev', 'test'].includes(env),
      `Environment can only be prod, dev, or test. Received [${env}].`
    );

    const file = ConfigRegistry.get(ConfigModule, env);

    assert(
      file,
      `ConfigModule on environment [${env}] not found in the ConfigModuleRegistry. Make sure that it was registered.`
    );

    return new ConfigModule(file);
  }

  /**
   * Returns the filepath of a registered ConfigModule.
   */
  public static get(
    aConfigModule: typeof ConfigModule<ConfigTransformer>,
    env: RegistryEnvironment
  ): string | undefined {
    return ConfigRegistry.instance().filepaths.get(aConfigModule)?.get(env);
  }

  /**
   * Sets the filepath of a ConfigModule on multiple environments using its filename.
   */
  public static set(
    aConfigModule: typeof ConfigModule<ConfigTransformer>,
    env: RegistryEnvironment,
    filename: string,
    shouldResolveFilepathUri = true
  ): void {
    const filepath = shouldResolveFilepathUri
      ? ConfigRegistry.resolve(env, filename)
      : `file://${filename}`;

    const isFilepathRegistered = Boolean(
      ConfigRegistry.instance().filepaths.get(aConfigModule)
    );

    if (!isFilepathRegistered)
      ConfigRegistry.instance().filepaths.set(
        aConfigModule,
        new Map([[env, filepath]])
      );
    else
      ConfigRegistry.instance()
        .filepaths.get(aConfigModule)!
        .set(env, filepath);
  }

  private static instance(): ConfigRegistry {
    if (!ConfigRegistry.registry) this.registry = new ConfigRegistry();
    return ConfigRegistry.registry as ConfigRegistry;
  }

  private static resolve(
    env: RegistryEnvironment,
    filename: string
  ): `file://${string}` {
    return `file://${path.resolve(process.cwd(), '.private', env, filename)}`;
  }
}
