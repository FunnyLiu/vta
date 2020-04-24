import { SyncHook, AsyncSeriesHook, AsyncParallelHook } from "tapable";
import {
  registDir as configRegistDir,
  resolveConfig as configResolveConfig,
  hooks as configHooks,
  Config,
  Store,
} from "@vta/config";
import { deepMerge } from "@vta/helpers";
import {
  App,
  AppConfigInternal,
  Hooks,
  PrepareHelpers,
  Worker,
  Plugin,
  FeatureOptions,
} from "./interface";
import ConfigPlugin from "./ConfigPlugin";

interface VtaAppOptions {
  cwd?: string;
  configFile?: string;
  silent?: boolean;
  dontRun?: boolean;
  arguments?: string[];
}

let idx = 0;

export default class VtaApp implements App {
  constructor(options: VtaAppOptions) {
    this.#options = options;
    this.cwd = options.cwd;
    this.silent = options.silent;
  }

  public cwd: Readonly<string>;

  public silent: Readonly<boolean>;

  public config: Readonly<Required<AppConfigInternal>>;

  #options: VtaAppOptions;

  #plugins: Plugin[];

  #pluginsAfter: Map<string, Plugin[]>;

  #registedPluginStack: string[];

  #registPlugin = (plugin: Plugin, after?: boolean): void => {
    if (after) {
      this.#pluginsAfter
        .get(this.#registedPluginStack[this.#registedPluginStack.length - 1])
        .push(plugin);
      return;
    }
    if (plugin && !this.#getPlugin(plugin.name)) {
      this.#pluginsAfter.set(plugin.name, []);
      this.#registedPluginStack.push(plugin.name);
      if (typeof plugin.prepare === "function") {
        plugin.prepare(this.#prepareHelpers);
      }
      this.#plugins.push(plugin);
      this.#registedPluginStack.pop();
      this.#pluginsAfter.get(plugin.name).forEach((p) => {
        this.#registPlugin(p);
      });
    }
  };

  #getPlugin = <P extends Plugin>(name: string): P => {
    return this.#plugins.filter((plugin) => plugin.name === name)[0] as P;
  };

  #features: Map<string, FeatureOptions>;

  #registFeature = (feature: string, options: FeatureOptions = {}) => {
    if (this.#features.has(feature)) {
      this.#features.set(feature, deepMerge(this.#features.get(feature), options));
    } else {
      this.#features.set(feature, options);
    }
  };

  public getFeature<T = FeatureOptions>(feature: string): T {
    if (this.#features.has(feature)) {
      return this.#features.get(feature) as T;
    }
    return null;
  }

  /* eslint-disable class-methods-use-this */
  public getArgument(arg: string): string | boolean {
    const { arguments: args } = this.#options;
    let argIdx = -1;
    for (let i = 0, len = args.length; i < len; i += 1) {
      if (args[i] === `--${arg}`) {
        argIdx = i;
        break;
      }
    }
    if (argIdx >= 0) {
      const nextArg = args[argIdx + 1];
      if (nextArg === undefined || nextArg.substr(0, 2) === "--") {
        return true;
      }
      if (nextArg.toLowerCase() === "true") {
        return true;
      }
      if (nextArg.toLowerCase() === "false") {
        return false;
      }
      return nextArg;
    }
    return undefined;
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  public resolvePluginOptions<T extends object = { [key: string]: any }>(
    plugin: Plugin,
    defaultOptions?: T,
    pluginOptions?: T,
  ): T {
    return deepMerge<object, T>({}, defaultOptions, pluginOptions, this.config.config[plugin.name]);
  }

  #prepareHelpers: Readonly<PrepareHelpers>;

  #preparePrepareHelpers = () => {
    this.#prepareHelpers = Object.freeze<PrepareHelpers>({
      app: {
        cwd: this.cwd,
        silent: this.silent,
        config: this.config,
        getArgument: this.getArgument.bind(this),
        resolvePluginOptions: this.resolvePluginOptions.bind(this),
      },
      registPlugin: this.#registPlugin,
      getPlugin: this.#getPlugin,
      registFeature: this.#registFeature,
    });
  };

  #privateHooks: {
    configInit: SyncHook<[]>;
    needRestart: AsyncSeriesHook<[]>;
  };

  public hooks: Readonly<Hooks>;

  #prepareHooks = (configCategory) => {
    const configInit = new SyncHook<[]>();
    this.#privateHooks = {
      configInit,
      needRestart: new AsyncSeriesHook<[]>(),
    };
    this.hooks = Object.freeze<Hooks>({
      config: {
        init(cb: (registDir: (dir: string) => void) => void): void {
          configInit.tap("regist-dir", () => {
            cb((dir) => {
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
      exit: new AsyncParallelHook<[Error]>(["err"]),
    });
  };

  #worker: Readonly<Worker>;

  #prepareWorker = (configCategory) => {
    this.#worker = Object.freeze<Worker>({
      resolveConfig<T = Config>(key: string): T {
        return configResolveConfig<T>(key, configCategory);
      },
    });
  };

  #prepare = (configCategory: string) => {
    this.#plugins = [];
    this.#pluginsAfter = new Map<string, Plugin[]>();
    this.#registedPluginStack = [];
    this.#features = new Map<string, FeatureOptions>();
    this.#preparePrepareHelpers();
    this.#prepareHooks(configCategory);
    this.#prepareWorker(configCategory);
  };

  public run(cb: (err: Error, resolveConfig?: <T = Config>(key: string) => T) => void) {
    try {
      const configCategory = `vta-${(idx += 1)}`;
      this.#prepare(configCategory);

      this.#registPlugin(
        new ConfigPlugin(
          { cwd: this.cwd, configFile: this.#options.configFile },
          (config) => {
            this.config = Object.freeze<Required<AppConfigInternal>>(config);
          },
          (dir) => {
            configRegistDir(dir, false, configCategory);
          },
          this.#privateHooks.needRestart,
        ),
      );
      this.#plugins.forEach((plugin) => {
        plugin.apply(this);
      });

      this.#privateHooks.configInit.call();

      const worker = this.#worker;
      this.hooks.ready.call(worker);
      if (this.#options.dontRun) {
        cb(undefined, worker.resolveConfig);
      } else {
        Promise.race([
          this.hooks.run.promise(worker).then(() => "run"),
          this.#privateHooks.needRestart.promise().then(() => "restart"),
        ])
          .then((mode) => {
            if (mode === "restart") {
              return this.hooks.restart.promise(this.#worker).then(() => {
                this.run(cb);
              });
            }
            return this.hooks.done.promise(worker).then(() => {
              this.hooks.exit
                .promise(undefined)
                .then(
                  () => undefined,
                  () => undefined,
                )
                .then(() => {
                  cb(undefined, worker.resolveConfig);
                });
            });
          })
          .catch((err) => {
            this.hooks.exit
              .promise(err)
              .then(
                () => undefined,
                () => undefined,
              )
              .then(() => {
                cb(err);
              });
          });
      }
    } catch (err) {
      this.hooks.exit
        .promise(err)
        .then(
          () => undefined,
          () => undefined,
        )
        .then(() => {
          cb(err);
        });
    }
  }
}
