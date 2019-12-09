import { SyncHook, AsyncSeriesHook, AsyncParallelHook } from "tapable";
import {
  registDir as configRegistDir,
  resolveConfig as configResolveConfig,
  hooks as configHooks,
  Config,
  Store,
} from "@vta/config";
import { App, Hooks, InitHelpers, Worker, Plugin } from "./interface";
import ConfigPlugin from "./ConfigPlugin";

interface VtaAppOptions {
  cwd?: string;
}

let idx = 0;

export default class VtaApp implements App {
  constructor({ cwd = process.cwd() }: VtaAppOptions = {}) {
    const initHook = new SyncHook<[InitHelpers]>(["helpers"]);
    const configInitHook = new SyncHook<[]>();
    let initHelpers;
    const configCategory = `vta-${(idx += 1)}`;
    this.configCategory = configCategory;
    this.cwd = cwd;
    this.privateHooks = { initHook, configInitHook };
    this.hooks = Object.freeze<Hooks>({
      init(cb: (helpers: InitHelpers) => void): void {
        if (initHelpers) {
          cb(initHelpers);
        } else {
          initHook.tap("init", helpers => {
            initHelpers = helpers;
            cb(initHelpers);
          });
        }
      },
      config: {
        init(cb: (registDir: (dir: string) => void) => void): void {
          configInitHook.tap("regist-dir", () => {
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
    });
  }

  private configCategory: string;

  private cwd: string;

  private privateHooks: { initHook: SyncHook<[InitHelpers]>; configInitHook: SyncHook<[]> };

  public hooks: Readonly<Hooks>;

  private plugins: Plugin[] = [];

  private registPlugin(plugin: Plugin): void {
    if (plugin && !this.getPlugin(plugin.name)) {
      plugin.apply(this);
      this.plugins.push(plugin);
    }
  }

  private getPlugin<P extends Plugin>(name: string): P {
    return this.plugins.filter(plugin => plugin.name === name)[0] as P;
  }

  public run(cb: (err: Error) => void) {
    try {
      const { configCategory } = this;
      this.registPlugin(
        new ConfigPlugin({ cwd: this.cwd }, dir => {
          configRegistDir(dir, false, configCategory);
        }),
      );
      this.privateHooks.initHook.call(
        Object.freeze({
          registPlugin: this.registPlugin.bind(this),
          getPlugin: this.getPlugin.bind(this),
        }),
      );
      this.privateHooks.configInitHook.call();
      const worker = Object.freeze({
        resolveConfig<T = Config>(key: string): T {
          return configResolveConfig<T>(key, configCategory);
        },
      });
      this.hooks.ready.call(worker);
      this.hooks.run
        .promise(worker)
        .then(() => this.hooks.done.promise(worker))
        .then(() => {
          cb(undefined);
        })
        .catch(err => {
          cb(err);
        });
    } catch (err) {
      cb(err);
    }
  }
}
