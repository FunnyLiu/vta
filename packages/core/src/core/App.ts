import { SyncHook, AsyncSeriesHook, AsyncParallelHook } from "tapable";
import {
  registDir as configRegistDir,
  resolveConfig as configResolveConfig,
  hooks as configHooks,
  Config,
  Store,
} from "@vta/config";
import { App, Hooks, PrepareHelpers, Worker, Plugin } from "./interface";
import ConfigPlugin from "./ConfigPlugin";

interface VtaAppOptions {
  cwd?: string;
  dontRun?: boolean;
}

let idx = 0;

export default class VtaApp implements App {
  constructor(options: VtaAppOptions) {
    this.options = options;
  }

  private options: VtaAppOptions;

  private plugins: Plugin[] = [];

  private registPlugin(plugin: Plugin): void {
    if (plugin && !this.getPlugin(plugin.name)) {
      if (typeof plugin.prepare === "function") {
        plugin.prepare(this.prepareHelpers);
      }
      plugin.apply(this);
      this.plugins.push(plugin);
    }
  }

  private getPlugin<P extends Plugin>(name: string): P {
    return this.plugins.filter(plugin => plugin.name === name)[0] as P;
  }

  private prepareHelpers: Readonly<PrepareHelpers>;

  private preparePrepareHelpers() {
    this.prepareHelpers = Object.freeze<PrepareHelpers>({
      registPlugin: this.registPlugin.bind(this),
      getPlugin: this.getPlugin.bind(this),
    });
  }

  private privateHooks: {
    configInit: SyncHook<[]>;
    needRestart: AsyncSeriesHook<[]>;
  };

  public hooks: Readonly<Hooks>;

  private prepareHooks(configCategory) {
    const configInit = new SyncHook<[]>();
    this.privateHooks = {
      configInit,
      needRestart: new AsyncSeriesHook<[]>(),
    };
    this.hooks = Object.freeze<Hooks>({
      config: {
        init(cb: (registDir: (dir: string) => void) => void): void {
          configInit.tap("regist-dir", () => {
            cb(dir => {
              configRegistDir(dir, true, configCategory);
            });
          });
        },
        itemBaseStart(key: string, cb: (store: Store) => void | Config): void {
          configHooks.onConfigBaseStart(key, cb, configCategory);
        },
        itemBaseDone(key: string, cb: (config: Config, store: Store) => void | Config): void {
          configHooks.onConfigBaseDone(key, cb, configCategory);
        },
        itemUserStart(key: string, cb: (config: Config, store: Store) => void | Config): void {
          configHooks.onConfigUserStart(key, cb, configCategory);
        },
        itemUserDone(key: string, cb: (config: Config, store: Store) => void | Config): void {
          configHooks.onConfigUserDone(key, cb, configCategory);
        },
        itemDone(key: string, cb: (config: Config, store: Store) => void | Config): void {
          configHooks.onConfigDone(key, cb, configCategory);
        },
      },
      ready: new SyncHook<[Worker]>(["worker"]),
      run: new AsyncSeriesHook<[Worker]>(["worker"]),
      done: new AsyncParallelHook<[Worker]>(["worker"]),
      restart: new AsyncParallelHook<[Worker]>(["worker"]),
    });
  }

  private worker: Readonly<Worker>;

  private prepareWorker(configCategory) {
    this.worker = Object.freeze<Worker>({
      resolveConfig<T = Config>(key: string): T {
        return configResolveConfig<T>(key, configCategory);
      },
    });
  }

  private prepare(configCategory: string) {
    this.preparePrepareHelpers();
    this.prepareHooks(configCategory);
    this.prepareWorker(configCategory);
  }

  public run(cb: (err: Error, resolveConfig?: <T = Config>(key: string) => T) => void) {
    try {
      const configCategory = `vta-${(idx += 1)}`;
      this.prepare(configCategory);

      this.registPlugin(
        new ConfigPlugin(
          { cwd: this.options.cwd },
          dir => {
            configRegistDir(dir, false, configCategory);
          },
          this.privateHooks.needRestart,
        ),
      );

      this.privateHooks.configInit.call();

      const { worker } = this;
      this.hooks.ready.call(worker);
      if (this.options.dontRun) {
        cb(undefined, worker.resolveConfig);
      } else {
        Promise.race([
          this.hooks.run.promise(worker).then(() => "run"),
          this.privateHooks.needRestart.promise().then(() => "restart"),
        ])
          .then(mode => {
            if (mode === "restart") {
              return this.hooks.restart.promise(this.worker).then(() => {
                this.plugins = [];
                this.run(cb);
              });
            }
            return this.hooks.done.promise(worker).then(() => {
              cb(undefined, worker.resolveConfig);
            });
          })
          .catch(err => {
            cb(err);
          });
      }
    } catch (err) {
      cb(err);
    }
  }
}
