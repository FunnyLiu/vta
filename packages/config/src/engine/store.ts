import path from "path";
import { deepMerge, loadModuleSync, clearRequireCache } from "@vta/helpers";
import { Config, Store, Events, Helpers } from "./interface";
import ConfigEvents from "./events";

export default class ConfigStore implements Store {
  constructor(helpers: Helpers) {
    this.helpers = helpers;
    if (process.env.VTA_JEST_TEST) {
      this.ext = "ts";
    }
  }

  public ext = "js";

  #config: { [key: string]: Config } = {};

  #loadingKeys: Set<string> = new Set();

  #dirs: Array<{ dir: string; baseMode: boolean }> = [];

  public events: Events = new ConfigEvents();

  public helpers: Helpers;

  public registDir(dir: string, baseMode = true) {
    if (this.#dirs.filter(({ dir: tempDir }) => tempDir === dir).length === 0) {
      const lastDir = this.#dirs[this.#dirs.length - 1];
      if (!lastDir || lastDir.baseMode) {
        this.#dirs.push({ dir, baseMode });
      } else {
        this.#dirs.splice(this.#dirs.length - 1, 0, { dir, baseMode });
      }
    }
  }

  public getItem(key: string) {
    if (!this.#config[key]) {
      this.#config[key] = {};
    }
    return this.#config[key];
  }

  #setItem = (key: string, config: Config) => {
    this.#config[key] = config || {};
  };

  /* eslint-disable @typescript-eslint/no-explicit-any */
  #resolveValue = (key: string, value, envContainer?: any[], matchEnv = false) => {
    if (
      Object.prototype.toString.call(value) === "[object Object]" &&
      value.constructor === {}.constructor
    ) {
      if (typeof value.type === "symbol" && this.helpers.has(value.type)) {
        return this.#resolveValue(
          key,
          this.helpers.resolve(this, key, value.type, value.payload),
          envContainer,
          matchEnv,
        );
      }

      /* eslint-disable no-param-reassign */
      Reflect.ownKeys(value).forEach((prop) => {
        if (matchEnv) {
          if (prop === (process.env.VTA_ENV || process.env.NODE_ENV || "development")) {
            envContainer.push(this.#resolveValue(key, value[prop]));
          }
        } else if (prop === "env" && Array.isArray(envContainer) && envContainer.length === 0) {
          const envs = value[prop];
          Reflect.deleteProperty(value, prop);
          envContainer.push(envs);
        } else {
          value[prop] = this.#resolveValue(key, value[prop]);
        }
      });
    }
    if (Array.isArray(value)) {
      return value.map((v) => this.#resolveValue(key, v));
    }
    return value;
  };

  public load(key: string): Config {
    if (this.#loadingKeys.has(key)) return this.getItem(key);
    this.#loadingKeys.add(key);

    let userModeDir = this.#dirs[this.#dirs.length - 1];
    if (userModeDir && userModeDir.baseMode) userModeDir = undefined;
    const baseModelDirs = userModeDir ? this.#dirs.slice(0, this.#dirs.length - 1) : this.#dirs;

    const mergeConfig = (config: Config) => {
      if (config) {
        const envContainer = [];
        this.#setItem(
          key,
          deepMerge(this.getItem(key), this.#resolveValue(key, config, envContainer)),
        );
        if (envContainer.length > 0) {
          this.#resolveValue(key, envContainer[0], envContainer, true);
          this.#setItem(key, deepMerge(this.getItem(key), envContainer[1]));
        }
      }
    };

    this.events.emit(`config-${key}-base-start`, mergeConfig);
    baseModelDirs.forEach(({ dir }) => {
      const envContainer = [];
      const file = path.resolve(dir, `${key}.config.${this.ext}`);
      const config = deepMerge(
        this.getItem(key),
        this.#resolveValue(key, loadModuleSync<Config>(file, {}), envContainer),
      );
      this.#setItem(key, config);
      if (envContainer.length > 0) {
        this.#resolveValue(key, envContainer[0], envContainer, true);
        this.#setItem(key, deepMerge(this.getItem(key), envContainer[1]));
      }
    });
    this.events.emit(`config-${key}-base-done`, this.getItem(key), mergeConfig);
    this.events.emit(`config-${key}-user-start`, this.getItem(key), mergeConfig);
    if (userModeDir) {
      const { dir } = userModeDir;
      const envContainer = [];
      const file = path.resolve(dir, `${key}.config.${this.ext}`);
      clearRequireCache(file);
      const config = deepMerge(
        this.getItem(key),
        this.#resolveValue(key, loadModuleSync<Config>(file, {}), envContainer),
      );
      this.#setItem(key, config);
      if (envContainer.length > 0) {
        this.#resolveValue(key, envContainer[0], envContainer, true);
        this.#setItem(key, deepMerge(this.getItem(key), envContainer[1]));
      }
    }
    this.events.emit(`config-${key}-user-done`, this.getItem(key), mergeConfig);
    this.events.emit(`config-${key}-done`, this.getItem(key));
    return this.getItem(key);
  }

  public reset() {
    this.#config = {};
    this.#loadingKeys = new Set();
    this.#dirs = [];
    this.events = new ConfigEvents();
  }
}
