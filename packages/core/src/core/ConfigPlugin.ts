import { AsyncSeriesHook } from "tapable";
import path from "path";
import { Plugin, App, AppConfig, PrepareHelpers } from "./interface";
import resolveConfig from "./utils/resolve-config";
import FsWatcherToRestartPlugin from "../plugins/fs-watcher-to-restart-plugin";

export default class ConfigPlugin extends Plugin {
  constructor(
    { cwd, configFile }: { cwd: string; configFile?: string },
    registConfig: (config: AppConfig) => void,
    registConfigDir: (dir: string) => void,
    needRestartHook: AsyncSeriesHook<[]>,
  ) {
    super("@vta/core/config");
    const { plugins, configFile: targetConfigFile, ...config } = resolveConfig(cwd, configFile);
    registConfig(config);
    this.plugins = plugins;
    this.configFile = targetConfigFile;
    registConfigDir(path.resolve(cwd, config.dirs.config));
    this.needRestartHook = needRestartHook;
  }

  private plugins: Plugin[];

  private configFile: string;

  private needRestartHook: AsyncSeriesHook<[]>;

  prepare(helpers: PrepareHelpers) {
    const checkors = [];
    this.needRestartHook.tapPromise(this.name, () => {
      return Promise.race(checkors).catch(() => new Promise(() => undefined));
    });
    helpers.registPlugin(new FsWatcherToRestartPlugin(checkors));
    this.plugins.forEach((plugin) => {
      helpers.registPlugin(plugin, true);
    });
  }

  /* eslint-disable class-methods-use-this */
  apply(app: App) {
    FsWatcherToRestartPlugin.watchDirectory(path.resolve(app.cwd, app.config.dirs.config), app);
    FsWatcherToRestartPlugin.watchFile(this.configFile, app);
  }
}
