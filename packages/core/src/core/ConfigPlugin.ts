import { AsyncSeriesHook } from "tapable";
import path from "path";
import * as chokidar from "chokidar";
import { Plugin, App, AppConfig, PrepareHelpers } from "./interface";
import resolveConfig from "./utils/resolve-config";

export default class ConfigPlugin extends Plugin {
  constructor(
    { cwd }: { cwd: string },
    registConfig: (config: AppConfig) => void,
    registConfigDir: (dir: string) => void,
    needRestartHook: AsyncSeriesHook<[]>,
  ) {
    super("@vta/core/config");
    const { plugins, ...config } = resolveConfig(cwd);
    registConfig(config);
    this.plugins = plugins;
    registConfigDir(path.resolve(cwd, config.dirs.config));
    this.needRestartHook = needRestartHook;
  }

  private plugins: Plugin[];

  private needRestartHook: AsyncSeriesHook<[]>;

  private registPlugin: (plugin: Plugin) => void;

  prepare(helpers: PrepareHelpers) {
    this.registPlugin = helpers.registPlugin;
  }

  apply(app: App) {
    let watcher;

    this.needRestartHook.tapPromise("watch config change", () => {
      return new Promise(resolve => {
        if (process.env.NODE_ENV === "development") {
          watcher = chokidar.watch(path.resolve(app.cwd, app.config.dirs.config), {
            ignoreInitial: true,
            followSymlinks: false,
          });
          watcher.on("all", () => {
            resolve();
          });
        }
      });
    });

    app.hooks.restart.tapPromise("restart-config", () => {
      return Promise.resolve(watcher ? watcher.close() : undefined);
    });

    app.hooks.done.tapPromise("done-config", () => {
      return Promise.resolve(watcher ? watcher.close() : undefined);
    });

    this.plugins.forEach(plugin => {
      this.registPlugin(plugin);
    });
  }
}
