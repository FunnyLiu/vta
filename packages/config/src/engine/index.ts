import { Helper, Store, Config } from "./interface";
import ConfigStore from "./store";
import ConfigHelpers from "./helpers";

const helpers = new ConfigHelpers();
const stores = new Map<string, Store>();
function getStore(category = "default") {
  if (!stores.has(category)) {
    stores.set(category, new ConfigStore(helpers));
  }
  return stores.get(category);
}
/* eslint-disable import/prefer-default-export */

/**
 * regist config helper
 * @param type helper type
 * @param helper receive store:Store,key:string,payload:T return anything
 */
export function registHelper<T>(type: symbol, helper: Helper<T>) {
  helpers.regist(type, helper);
}

/**
 * regist config dir. baseMode=false is always last one. with baseModel=true
 * @param dir config dir
 * @param category config category
 */
export function registDir(dir: string, category?: string);
/**
 * regist config dir. baseMode=false is always last one
 * @param dir config dir
 * @param baseMode user's config please set false. default true
 * @param category config category
 */
export function registDir(dir: string, baseMode?: boolean, category?: string);

export function registDir(dir: string, baseMode?: string | boolean, category?: string) {
  const store = getStore(typeof baseMode === "string" ? baseMode : category);
  store.registDir(dir, typeof baseMode === "string" ? true : baseMode);
}

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * get the sepecific key's config
 * @param key config key.`${key}.config.js`
 * @param category config category
 */
export function resolveConfig<T = Config>(key: string, category?: string): T {
  const store = getStore(category);
  return store.load(key) as any;
}

/**
 * reset config store,you can get the newer config
 * @param category config category
 */
export function reset(category?: string): void {
  const store = getStore(category);
  return store.reset();
}

export const hooks = {
  /**
   * start getting base config of specific key
   * @param key config key
   * @param cb callback, receive store, optional return additional config
   * @param category config category
   */
  onConfigBaseStart(key: string, cb: (store: Store) => void | Config, category?: string) {
    const store = getStore(category);
    store.events.on(`config-${key}-base-start`, mergeConfig => {
      mergeConfig(cb(store));
    });
  },
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
  ) {
    const store = getStore(category);
    store.events.on(`config-${key}-base-done`, (config, mergeConfig) => {
      mergeConfig(cb(store.getItem(key), store));
    });
  },
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
  ) {
    const store = getStore(category);
    store.events.on(`config-${key}-user-start`, (config, mergeConfig) => {
      mergeConfig(cb(store.getItem(key), store));
    });
  },
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
  ) {
    const store = getStore(category);
    store.events.on(`config-${key}-user-done`, (config, mergeConfig) => {
      mergeConfig(cb(store.getItem(key), store));
    });
  },
  /**
   * has getted config of specific key
   * @param key config key
   * @param cb callback, receive current config and store
   * @param category config category
   */
  onConfigDone(key: string, cb: (config: Config, store: Store) => void, category?: string) {
    const store = getStore(category);
    store.events.on(`config-${key}-done`, config => {
      cb(config, store);
    });
  },
};

/**
 * set the config's ext. default is js. only use for jest
 * @param ext
 */
export function setStoreExt(ext: string, category?: string) {
  const store: ConfigStore = getStore(category) as ConfigStore;
  store.ext = ext;
}
