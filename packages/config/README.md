# @vta/config

vta config system

![npm](https://img.shields.io/npm/v/@vta/config) [![Build Status](https://travis-ci.com/vta-js/vta.svg?branch=master)](https://travis-ci.com/vta-js/vta)

## Summary

this config system support loading some configs from one config file named like `babel.config.js` in user's config directory and some registed base config directories. support config dependency, like `app.config.js` dependent some configs in `babel.config.js`

## Install

```bash
yarn add @vta/config
```

## Usage

### regist config directory

```typescript
function registDir(dir: string, baseMode?: boolean, category?: string);
```

in order to use this system, you should first regist some config directories. if `baseMode` is **false**, this directory will processed last, otherwise will processed it in your registed orders. you can use different config system by pass `category`.

### (optional) regist config helpers

```typescript
function registHelper<T>(type: symbol, helper: Helper<T>);
```

this config system has some [built in helpers](#built-in-helpers), if these helpers dont satisfy you, you can [regist your own helpers](#regist-your-own-helpers).

### write config file

```javascript
// webapck.config.js
const { useDeps } = require("@vta/config");

module.exports = useDeps("babel", babelConfig => {
  return {
    module: {
      rules: [{ type: /\.jsx$/, loader: "babel-loader", options: babelConfig }],
    },
  };
});
```

you should write your config file in your registed config directory named like `[key].config.js`, the key is the config key passed to `resolveConfig`, the key can be anything. in this config file, you should return an object that will `deepMerged` into base config.you can use some [hooks](#hooks) in other system.

#### env support

in your config file, you can use env system. it will match `process.env.VTA_ENV || process.env.NODE_ENV`. we will firstly `deepMerged` all un env specific configs, then `deepMerged` the matched env configs.

```javascript
import { useBase } from "@vta/config";

export default useBase(base => ({
  env: {
    development: { mode: `${base.appid}-development`, devMode: { active: true } },
    production: { mode: `${base.appid}-production` },
  },
}));
```

### resolve config

```typescript
function resolveConfig<T = Config>(key: string, category?: string): T;
```

you can get user's config through this function

### (optional) reset config system

```typescript
function reset(category?: string): void;
```

reset config store,you can get the newer config. when reseted, the config system is empty and you should `regist config dir` and `optional regist config helpers` again to load the newer config

## Helpers

```typescript
function registHelper<T>(type: symbol, helper: Helper<T>);

export declare type Helper<T> = (store: Store, key: string, payload: T) => any;
export declare interface ConfigByHelper<T> {
  type: symbol;
  payload: T;
}
```

one helper is a function that receive this config **store** and now resolved config **key** and some user's **payload** and return anything. each helper has an unique symbol **type**, when called in `config file`, this helper should return an object that has **type** equel to helper's type and **payload** related to user's arguments

### built in helpers

#### useBase

```typescript
function useBase(cb: (config: Config) => Config);
```

you can get the base config of current key and return additional config in the callback

#### useDeps

```typescript
function useDeps(dep: string, cb?: (config: Config) => Config);
function useDeps(deps: string[], cb?: (configs: Config[]) => Config);
```

you can dependent some other config key's config to return additional config in the callback

#### mutate

```typescript
function mutate(options: MutateOptions, cb?: (config: Config) => Config);
function mutate(options: MutateOptions[], cb?: (config: Config) => Config);

declare interface MutateOptions {
  path: string;
  value: any;
  mode?: SetJsonValueMode;
}
```

you can mutate some base config through one json path and a mutate mode, see [here](https://github.com/vta-js/vta/tree/master/packages/helpers/src/helpers/set-json-value) to view detail. optional return additional config in the callback

#### useValue

```typescript
function useValue(path: ValuePath, cb?: (value: any) => Config);
function useValue(path: ValuePath[], cb?: (values: any[]) => Config);

declare type ValuePath = string | { path: string; key: string };
```

you can use some value of the base config through one json path, see [here](https://github.com/vta-js/vta/tree/master/packages/helpers/src/helpers/read-json-value) to view detail. and return additional config in the callback

### regist your own helpers

if these helpers dont satisfy you, you can regist your own helpers.

1. define helper's **type**
2. call `registHelper`, in the callback process with current resolved **key** and user's **payload**
3. export a function that receive user's arguments and return a `ConfigByHelper` object with **type** and **payload**

useBase Example

```javascript
import { registHelper } from "@vta/config";

const TYPE = Symbol("config-helper-use-base");

registHelper(TYPE, (store, key, payload) => {
  return payload(store.getItem(key));
});

/**
 * use base config and return additional config by cb
 * @param cb receive config and return additional config
 */
export default function useBase(cb) {
  return { type: TYPE, payload: cb };
}
```

## Hooks

you can use some hooks in the processing. in hooks, you can use any valid [helpers](#helpers)

```typescript
export declare const hooks: {
  /**
   * start getting base config of specific key
   * @param key config key
   * @param cb callback, receive store, optional return additional config
   * @param category config category
   */
  onConfigBaseStart(key: string, cb: (store: Store) => void | Config, category?: string): void;
  /**
   * has getted base config of specific key
   * @param key config key
   * @param cb callback, receive current config and store, optional return additional config
   * @param category config category
   */
  onConfigBaseDone(
    key: string,
    cb: (config: Config, store: Store) => void | Config,
    category?: string,
  ): void;
  /**
   * start getting user config of specific key
   * @param key config key
   * @param cb callback, receive current config and store, optional return additional config
   * @param category config category
   */
  onConfigUserStart(
    key: string,
    cb: (config: Config, store: Store) => void | Config,
    category?: string,
  ): void;
  /**
   * has getted user config of specific key
   * @param key config key
   * @param cb callback, receive current config and store, optional return additional config
   * @param category config category
   */
  onConfigUserDone(
    key: string,
    cb: (config: Config, store: Store) => void | Config,
    category?: string,
  ): void;
  /**
   * has getted config of specific key
   * @param key config key
   * @param cb callback, receive current config and store
   * @param category config category
   */
  onConfigDone(key: string, cb: (config: Config, store: Store) => void, category?: string): void;
};
```

## MIT License
