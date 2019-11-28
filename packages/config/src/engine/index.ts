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

export const hooks = {
  onConfigBaseStart(key: string, cb: (store: Store) => void | Config, category?: string) {
    const store = getStore(category);
    store.events.on(`config-${key}-base-start`, mergeConfig => {
      mergeConfig(cb(store));
    });
  },
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
  onConfigUserStart(key: string, cb: (store: Store) => void | Config, category?: string) {
    const store = getStore(category);
    store.events.on(`config-${key}-user-start`, mergeConfig => {
      mergeConfig(cb(store));
    });
  },
  onConfigUserGetted(
    key: string,
    cb: (config: Config, store: Store) => void | Config,
    category?: string,
  ) {
    const store = getStore(category);
    store.events.on(`config-${key}-user-getted`, (config, mergeConfig) => {
      mergeConfig(cb(store.getItem(key), store));
    });
  },
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
};

/**
 * set the config's ext. default is js. only use for jest
 * @param ext
 */
export function setStoreExt(ext: string, category?: string) {
  const store: ConfigStore = getStore(category) as ConfigStore;
  store.ext = ext;
}
