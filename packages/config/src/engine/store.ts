import path from "path";
import { deepMerge } from "@vta/helpers";
import { Config, Store, Events, Helpers } from "./interface";
import ConfigEvents from "./events";
import loadModule from "./utils/load-module";

export default class ConfigStore implements Store {
  constructor(helpers: Helpers) {
    this.helpers = helpers;
  }

  public ext = "js";

  private config: { [key: string]: Config } = {};

  private loadingKeys: Set<string> = new Set();

  private dirs: Array<{ dir: string; baseMode: boolean }> = [];

  public events: Events = new ConfigEvents();

  public helpers: Helpers;

  public registDir(dir: string, baseMode = true) {
    const lastDir = this.dirs[this.dirs.length - 1];
    if (!lastDir || lastDir.baseMode) {
      this.dirs.push({ dir, baseMode });
    } else {
      this.dirs.splice(this.dirs.length - 1, 0, { dir, baseMode });
    }
  }

  public getItem(key: string) {
    return this.config[key] || {};
  }

  public setItem(key: string, config: Config) {
    this.config[key] = config || {};
  }

  public resolveValue(key: string, value) {
    if (Object.prototype.toString.call(value) === "[object Object]") {
      if (typeof value.type === "symbol" && this.helpers.has(value.type)) {
        return this.resolveValue(key, this.helpers.resolve(this, key, value.type, value.payload));
      }
      /* eslint-disable no-param-reassign */
      Object.keys(value).forEach(prop => {
        value[prop] = this.resolveValue(key, value[prop]);
      });
      Reflect.ownKeys(value).forEach(prop => {
        value[prop] = this.resolveValue(key, value[prop]);
      });
    }
    if (Array.isArray(value)) {
      return value.map(v => this.resolveValue(key, v));
    }
    return value;
  }

  clear() {
    this.config = {};
    this.loadingKeys = new Set();
    this.dirs = [];
    this.events = new ConfigEvents();
  }

  public load(key: string): Config {
    if (this.loadingKeys.has(key)) return this.getItem(key);
    this.loadingKeys.add(key);

    let userModeDir = this.dirs[this.dirs.length - 1];
    if (userModeDir.baseMode) userModeDir = undefined;
    const baseModelDirs = userModeDir ? this.dirs.slice(0, this.dirs.length - 1) : this.dirs;

    this.events.emit(`config-${key}-base-start`);
    baseModelDirs.forEach(({ dir }) => {
      const config = deepMerge(
        this.getItem(key),
        this.resolveValue(
          key,
          loadModule<Config>(path.resolve(dir, `${key}.config.${this.ext}`), {}),
        ),
      );
      this.setItem(key, config);
    });
    this.events.emit(`config-${key}-base-done`, this.getItem(key));
    this.events.emit(`config-${key}-user-start`);
    if (userModeDir) {
      const { dir } = userModeDir;
      const config = this.resolveValue(
        key,
        loadModule<Config>(path.resolve(dir, `${key}.config.${this.ext}`), {}),
      );
      const mergedConfig = deepMerge(this.getItem(key), config);
      this.events.emit(`config-${key}-user-getted`, mergedConfig, config);
      this.setItem(key, mergedConfig);
    } else {
      this.events.emit(`config-${key}-user-getted`, this.getItem(key), {});
    }
    this.events.emit(`config-${key}-user-done`, this.getItem(key));
    return this.getItem(key);
  }
}
