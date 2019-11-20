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
 * regist config dir. baseMode=false is always last one
 * @param dir config dir
 * @param baseMode user's config please set false. default true
 * @param category config category
 */
export function registDir(dir: string, baseMode = true, category?: string) {
  const store = getStore(category);
  store.registDir(dir, baseMode);
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
 * clear store
 * @param category config category
 */
export function clearStore(category?: string) {
  const store = getStore(category);
  store.clear();
}

export const hooks = {
  onConfigBaseStart(key: string, cb: (store: Store) => void, category?: string) {
    const store = getStore(category);
    store.events.on(`config-${key}-base-start`, () => {
      cb(store);
    });
  },
  onConfigBaseDone(key: string, cb: (config: Config, store: Store) => void, category?: string) {
    const store = getStore(category);
    store.events.on(`config-${key}-base-done`, config => {
      cb(config, store);
    });
  },
  onConfigUserStart(key: string, cb: (store: Store) => void, category?: string) {
    const store = getStore(category);
    store.events.on(`config-${key}-user-start`, () => {
      cb(store);
    });
  },
  onConfigUserGetted(
    key: string,
    cb: (mergedConfig: Config, config: Config, store: Store) => void,
    category?: string,
  ) {
    const store = getStore(category);
    store.events.on(`config-${key}-user-getted`, (mergedConfig, config) => {
      cb(mergedConfig, config, store);
    });
  },
  onConfigUserDone(key: string, cb: (config: Config, store: Store) => void, category?: string) {
    const store = getStore(category);
    store.events.on(`config-${key}-user-done`, config => {
      cb(config, store);
    });
  },
};

/**
 * set the config's ext. default is js. only use for jest
 * @param ext
 */
export function setStoreExt(ext = "js", category?: string) {
  const store: ConfigStore = getStore(category) as ConfigStore;
  store.ext = ext;
}
