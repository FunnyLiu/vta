import { AsyncParallelHook, AsyncSeriesHook, SyncHook } from "tapable";
import { Config, Store } from "@vta/config";

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */

export declare interface Plugin {
  (options: object): void;
}

export class Plugin {
  constructor(name: string) {
    this.name = name;
  }

  /**
   * plugin name. one name only run once
   */
  public name: string;

  /**
   * plugin prepare,some processing like registPlugin or registConfigDir. receive PrepareHelpers.
   * @param helpers
   */
  public prepare(helpers: PrepareHelpers): void {}

  /**
   * apply this plugin for worker
   * @param worker app worker
   */
  public apply(app: App): void {}
}

export interface VtaConfig {
  /**
   * some dirs
   */
  dirs?: {
    /**
     * config dir. default config
     */
    config?: string;
    /**
     * src dir. default src
     */
    src?: string;
    /**
     * build dir. default build
     */
    build?: string;
  };
  /**
   * plugins that used
   */
  plugins?: Array<Plugin | [string, object]>;
  /**
   * env config. process.env.VTA_ENV || process.env.NODE_ENV
   * deepMerge(others,envConfig);
   */
  env?: { [key: string]: VtaConfig };
}

export declare type AppConfig = Omit<VtaConfig, "plugins" | "env">;

export declare interface App {
  /**
   * app hooks
   */
  hooks: Readonly<Hooks>;
  /**
   * current working directory
   */
  cwd: string;
  /**
   * app config. Omit<VtaConfig, "plugins" | "env">
   */
  config: AppConfig;
}

export declare interface Worker {
  /**
   * get config of specific key
   * @param key config key
   */
  resolveConfig<T = Config>(key: string): T;
}

export declare interface Hooks {
  /**
   * config system using vta/config
   */
  config: {
    /**
     * config system init. regist the config's dir
     * @param registDir regist config dir with baseMode = true
     */
    init(cb: (registDir: (dir: string) => void) => void): void;
    /**
     * start getting base config of specific key
     * @param key config key
     * @param cb callback, receive store, optional return additional config
     */
    itemBaseStart(key: string, cb: (store: Store) => void | Config): void;
    /**
     * has getted base config of specific key
     * @param key config key
     * @param cb callback, receive current config and store, optional return additional config
     */
    itemBaseDone(key: string, cb: (config: Config, store: Store) => void | Config): void;
    /**
     * start getting user config of specific key
     * @param key config key
     * @param cb callback, receive current config and store, optional return additional config
     */
    itemUserStart(key: string, cb: (config: Config, store: Store) => void | Config): void;
    /**
     * has getted user config of specific key
     * @param key config key
     * @param cb callback, receive current config and store, optional return additional config
     */
    itemUserDone(key: string, cb: (config: Config, store: Store) => void | Config): void;
    /**
     * has getted config of specific key
     * @param key config key
     * @param cb callback, receive current config and store
     */
    itemDone(key: string, cb: (config: Config, store: Store) => void): void;
  };
  /**
   * app ready hook
   */
  ready: SyncHook<[Worker]>;
  /**
   * app run hook
   */
  run: AsyncSeriesHook<[Worker]>;
  /**
   * app done hook
   */
  done: AsyncParallelHook<[Worker]>;
  /**
   * app restart hook
   * you can clean some object in this hook.
   * when processed success,app will restart and call in this order:
   *   1. reload plugins
   *   2. plugin.apply
   *   3. app.config.init
   *   4. app.ready
   *   5. app.run
   *   6. optional app.restart
   *   7. app.done
   */
  restart: AsyncParallelHook<[Worker]>;
}

export declare interface PrepareHelpers {
  /**
   * regist another plugin
   * @param plugin another plugin
   */
  registPlugin(plugin: Plugin): void;
  /**
   * get one plugin
   * @param name plugin name
   */
  getPlugin<P extends Plugin>(name: string): P;
}
