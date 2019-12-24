import { SyncHook, AsyncSeriesHook, AsyncParallelHook } from "tapable";
import {
  registDir as configRegistDir,
  resolveConfig as configResolveConfig,
  hooks as configHooks,
  Config,
  Store,
} from "@vta/config";
import { deepMerge } from "@vta/helpers";
import { App, AppConfig, Hooks, PrepareHelpers, Worker, Plugin, FeatureOptions } from "./interface";
import ConfigPlugin from "./ConfigPlugin";

interface VtaAppOptions {
  cwd?: string;
  silent?: boolean;
  dontRun?: boolean;
}

let idx = 0;

export default class VtaApp implements App {
  constructor(options: VtaAppOptions) {
    this.options = options;
    this.cwd = options.cwd;
    this.silent = options.silent;
  }

  public cwd: Readonly<string>;

  public silent: Readonly<boolean>;

  public config: Readonly<AppConfig>;

  private options: VtaAppOptions;

  private plugins: Plugin[];

  private registPlugin(plugin: Plugin): void {
    if (plugin && !this.getPlugin(plugin.name)) {
      if (typeof plugin.prepare === "function") {
        plugin.prepare(this.prepareHelpers);
      }
      this.plugins.push(plugin);
    }
  }

  private getPlugin<P extends Plugin>(name: string): P {
    return this.plugins.filter(plugin => plugin.name === name)[0] as P;
  }

  private features: Map<string, FeatureOptions>;

  private registFeature(feature: string, options: FeatureOptions = {}) {
    if (this.features.has(feature)) {
      this.features.set(feature, deepMerge(this.features.get(feature), options));
    } else {
      this.features.set(feature, options);
    }
  }

  public getFeature<T = FeatureOptions>(feature: string): T {
    if (this.features.has(feature)) {
      return this.features.get(feature) as T;
    }
    return null;
  }

  private prepareHelpers: Readonly<PrepareHelpers>;

  private preparePrepareHelpers() {
    this.prepareHelpers = Object.freeze<PrepareHelpers>({
      registPlugin: this.registPlugin.bind(this),
      getPlugin: this.getPlugin.bind(this),
      registFeature: this.registFeature.bind(this),
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
    this.plugins = [];
    this.features = new Map<string, FeatureOptions>();
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
          { cwd: this.cwd },
          config => {
            this.config = Object.freeze<AppConfig>(config);
          },
          dir => {
            configRegistDir(dir, false, configCategory);
          },
          this.privateHooks.needRestart,
        ),
      );
      this.plugins.forEach(plugin => {
        plugin.apply(this);
      });

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
