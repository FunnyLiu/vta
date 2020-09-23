import path from "path";
import fs from "fs";
import chokidar from "chokidar";
import { clearRequireCache } from "@vta/helpers";
import { Plugin, App } from "../core/interface";

function clearRequireCacheOfDirectory(dir) {
  try {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const target = path.resolve(dir, file);
      if (fs.statSync(target).isDirectory()) {
        clearRequireCacheOfDirectory(target);
      } else {
        clearRequireCache(target);
      }
    });
  } catch {} // eslint-disable-line
}

const pluginMap = new Map<App, FsWatcherToRestartPlugin>();

export default class FsWatcherToRestartPlugin extends Plugin {
  constructor(checkors: Array<Promise<void>>) {
    // 插件名称
    super("@vta/core/restart-file-watchor");
    this.#checkors = checkors;
    checkors.push(new Promise(() => undefined));
  }

  #checkors: Array<Promise<void>>;

  static watchDirectory(dir: string, app: App) {
    const instance = pluginMap.get(app);
    if (instance) {
      instance.#addWatcher(dir, app, true);
    }
  }

  static watchFile(file: string, app: App) {
    const instance = pluginMap.get(app);
    if (instance) {
      instance.#addWatcher(file, app, false);
    }
  }

  #addWatcher = (target: string, app: App, isDir: boolean) => {
    const watcher = chokidar.watch(target, {
      ignoreInitial: true,
      followSymlinks: false,
    });

    this.#checkors.push(
      new Promise((resolve) => {
        watcher.on("all", () => {
          if (isDir) {
            clearRequireCacheOfDirectory(target);
          } else {
            clearRequireCache(require.resolve(target));
          }
          resolve();
        });
      }),
    );
    //在生命周期的某些阶段，做一些事情
    // 关闭的时候，记得对应的监听回收掉
    app.hooks.restart.tapPromise(this.name, () => {
      return watcher.close();
    });

    app.hooks.done.tapPromise(this.name, () => {
      return watcher.close();
    });
  };
  // 提供apply方法
  apply(app: App) {
    if (process.env.NODE_ENV === "development") {
      pluginMap.set(app, this);
    }
  }
}
