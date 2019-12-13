import { AsyncSeriesHook } from "tapable";
import path from "path";
import * as chokidar from "chokidar";
import { Plugin, App, PrepareHelpers, VtaConfig } from "./interface";
import resolveConfig from "./utils/resolve-config";

export default class ConfigPlugin extends Plugin {
  constructor(
    { cwd }: { cwd: string },
    registConfigDir: (dir: string) => void,
    needRestartHook: AsyncSeriesHook<[]>,
  ) {
    super("@vta/core/config");
    this.cwd = cwd;
    this.registConfigDir = registConfigDir;
    this.needRestartHook = needRestartHook;
    this.config = resolveConfig(cwd);
  }

  private cwd: string;

  private config: Omit<VtaConfig, "plugins"> & { plugins: Plugin[] };

  private registConfigDir: (dir: string) => void;

  private needRestartHook: AsyncSeriesHook<[]>;

  private registPlugin: (plugin: Plugin) => void;

  prepare(helpers: PrepareHelpers) {
    this.registPlugin = helpers.registPlugin;
  }

  apply(app: App) {
    const { dirs } = this.config;
    app.hooks.config.init(() => {
      this.registConfigDir(path.resolve(this.cwd, dirs.config));
    });
    app.hooks.config.itemBaseStart("app", () => ({ dirs }));

    let watcher;

    this.needRestartHook.tapPromise("watch config change", () => {
      return new Promise(resolve => {
        if (process.env.NODE_ENV === "development") {
          watcher = chokidar.watch(path.resolve(this.cwd, dirs.config), {
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

    this.config.plugins.forEach(plugin => {
      this.registPlugin(plugin);
    });
  }
}
