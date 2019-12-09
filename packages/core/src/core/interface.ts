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
}

export declare interface App {
  /**
   * app hooks
   */
  hooks: Readonly<Hooks>;
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
}

export declare interface PrepareHelpers {
  /**
   * regist config dir with baseMode = true
   * @param dir config dir
   */
  registConfigDir(dir: string): void;
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
