import { AsyncSeriesHook } from "tapable";
import path from "path";
import { Plugin, App, AppConfigInternal, PrepareHelpers } from "./interface";
import resolveConfig from "./utils/resolve-config";
import FsWatcherToRestartPlugin from "../plugins/fs-watcher-to-restart-plugin";
// 定义一个插件，专门管理配置
export default class ConfigPlugin extends Plugin {
  constructor(
    { cwd, configFile }: { cwd: string; configFile?: string },
    registConfig: (config: Required<AppConfigInternal>) => void,
    registConfigDir: (dir: string) => void,
    needRestartHook: AsyncSeriesHook<[]>,
  ) {
    super("@vta/core/config");
    // 取得配置
    // resolveConfig很关键，用来在配置文件只读取配置
    const { plugins, configFile: targetConfigFile, ...config } = resolveConfig(cwd, configFile);
    registConfig(config);
    this.#plugins = plugins;
    // cli传入的--config配置文件
    this.#configFile = targetConfigFile;
    this.#configDir = path.resolve(cwd, config.dirs.config);
    registConfigDir(this.#configDir);

    this.#needRestartHook = needRestartHook;
  }

  #plugins: Plugin[];

  #configFile: string;

  #configDir: string;

  #needRestartHook: AsyncSeriesHook<[]>;

  prepare(helpers: PrepareHelpers) {
    const checkors = [];
    this.#needRestartHook.tapPromise(this.name, () => {
      return Promise.race(checkors).catch(() => new Promise(() => undefined));
    });
    helpers.registPlugin(new FsWatcherToRestartPlugin(checkors));
    this.#plugins.forEach((plugin) => {
      helpers.registPlugin(plugin, true);
    });
  }

  /* eslint-disable class-methods-use-this */
  apply(app: App) {
    // 监听配置文件的变化
    FsWatcherToRestartPlugin.watchDirectory(this.#configDir, app);
    FsWatcherToRestartPlugin.watchFile(this.#configFile, app);
  }
}
