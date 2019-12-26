# vta

a pluggable Typescript/Javascript development framework

![npm](https://img.shields.io/npm/v/vta) [![Build Status](https://travis-ci.com/vta-js/vta.svg?branch=master)](https://travis-ci.com/vta-js/vta)

## Summary

vta is a pluggable Typescript/Javascript development framework, through some built in plugins you can develop or build your app out of box. when development, if your config system has something changed, the app can automatic restart to apply your new config.

## Install

```bash
yarn add vta --dev
```

## Usage

```json
{
  "scripts": {
    "start": "vta start --env development",
    "build": "vta build --env production"
  }
}
```

## Processiong Order

1. load user's root config
2. regist used plugins
3. run plugin's **prepare** method
4. run plugin's **apply** method
5. synchronous call **hooks.config.init** to regist plugin's config directory
6. synchronous call **hooks.ready** when app is ready to run
7. asynchronous call **hooks.run** when app runing
8. optional asynchronous call **hooks.restart** when some config has changed and **NODE_ENV** is **development**
9. asynchronous call **hooks.done** when app has done

## Config System

```typescript
export interface VtaConfig {
  dirs?: {
    config: string; // default config
    src: string; // default src
    build: string; // default dist
  };
  presets: Array<[string, object?]>;
  plugins: Array<Plugin | [string, object?]>;
  env?: { [key: string]: VtaConfig }; // support env system
}
```

vta use [@vta/config](https://github.com/vta-js/vta/tree/master/packages/config) as a config system. firstly, you should create a root config file named `.vta{.config}.js{on}`, in this file you can regist used plugins, and optional specific `config/src/build` directory.

### plugins usage

the plugins usage support two methods. you can use an array which first element is the plugin name/path and the second element is the plugin options. in js file, you can also use a `Plugin` instance.

### plugin shorthand

if the name of the package is prefixed with `vta-plugin-`, you can use a shorthand

- `vue` is equivalent to `vta-plugin-vue`.
- `@vta/vue` is equivalent to `@vta/plugin-vue`.
- `@others/vue` is equivalent to `@others/vta-plugin-vue`.

### presets usage

```typescript
export declare type Preset = (
  options?: object,
) => {
  presets?: Array<[string, object?]>;
  plugins?: Array<Plugin | [string, object?]>;
};
```

a preset is a function that receive optional options and return a plugins list or another presets list. the presets usage only support an array which first element is the preset name/path and the second element is the preset options.

### preset shorthand

if the name of the package is prefixed with `vta-preset-`, you can use a shorthand

- `vue` is equivalent to `vta-preset-vue`.
- `@vta/vue` is equivalent to `@vta/preset-vue`.
- `@others/vue` is equivalent to `@others/vta-preset-vue`.

### plugin/preset ordering

- Presets run before Plugins.
- Preset ordering is first to last.
- Plugin ordering is first to last.

## Plugin Interface

```typescript
class Plugin {
  constructor(name: string) {
    this.name = name;
  }
  public name: string;
  public prepare(helpers: PrepareHelpers): void {}
  public apply(app: App): void {}
}
```

a plugin is a class that has a `name` property and a `apply` function which can process the app processing. each name only run once. you can extends `Plugin` to make your own plugin

### prepare

```typescript
export declare interface AppBase {
  /**
   * current working directory
   */
  cwd: Readonly<string>;
  /**
   * dont print anything
   */
  silent: boolean;
  /**
   * app config. Omit<VtaConfig, "plugins" | "env">
   */
  config: Readonly<AppConfig>;
  /**
   * get the argument passed by cli
   * @param arg argument. eg preset for --preset,no-push for --no-push
   */
  getArgument(arg: string): string | boolean;
}
export declare interface PrepareHelpers {
  /**
   * app
   */
  app: AppBase;
  /**
   * regist another plugin
   * @param plugin another plugin
   * @param after regist plugin after this plugin has registed. default false
   */
  registPlugin(plugin: Plugin, after?: boolean): void;
  /**
   * get one plugin
   * @param name plugin name
   */
  getPlugin<P extends Plugin>(name: string): P;
  /**
   * regist feature
   * @param feature feature
   * @param options feature options,will deep merge with the registed options, default {}
   */
  registFeature(feature: string, options?: FeatureOptions): void;
}
```

through `prepare` function,you can prepare something like regist other dependent plugins or regist some features. if this plugin should dependent some other plugins, in order to allow run correctly even if user dont regist it, you should regist it through `registPlugin`. in order to communicate with some other plugins, you can regist some feature with options through `registFeature`.

### apply

```typescript
export declare interface App extends AppBase {
  /**
   * app hooks
   */
  hooks: Readonly<Hooks>;
  /**
   * get feature options. return null if not registed
   * @param feature feature
   */
  getFeature(feature: string): FeatureOptions;
}
```

when all plugins has prepared, vta will run `apply` for each plugin with one App argument. in this function, you can response some [hooks](#Hooks) to do something. if you want communicate with other plugins, you can use `getFeature` to get the registed feature.

## Hooks

```typescript
export declare interface Hooks {
  config: {
    init(cb: (registDir: (dir: string) => void) => void): void;
    itemBaseStart(key: string, cb: (store: Store) => void | Config): void;
    itemBaseDone(key: string, cb: (config: Config, store: Store) => void | Config): void;
    itemUserStart(key: string, cb: (config: Config, store: Store) => void | Config): void;
    itemUserDone(key: string, cb: (config: Config, store: Store) => void | Config): void;
    itemDone(key: string, cb: (config: Config, store: Store) => void): void;
  };
  ready: SyncHook<[Worker]>;
  run: AsyncSeriesHook<[Worker]>;
  done: AsyncParallelHook<[Worker]>;
  restart: AsyncParallelHook<[Worker]>;
  exit: AsyncParallelHook<[Error]>;
}

export declare interface Worker {
  resolveConfig<T = Config>(key: string): T;
}
```

hooks use [tapable](https://github.com/webpack/tapable) engine. config hooks use [@vta/config](https://github.com/vta-js/vta/tree/master/packages/config) engine. you can response these hooks to do anything. when call `resolveConfig` of worker in any hooks, the **config.itemBaseStart** and so on will be called only once for each resolved **key**.

## resolveConfig

if you want get user's specific key's configs, you should use this function. in this function call, vta will not call **hooks.run** and any other hooks called after this.

```typescript
import { resolveConfig } from "vta";

export default function vtaBabelPreset() {
  const { presets = [], plugins = [] } = resolveConfig("babel") || {};
  return { presets, plugins };
}
```

## MIT License
