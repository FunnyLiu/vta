import { Helper, Helpers, Store } from "./interface";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default class ConfigHelpers implements Helpers {
  #helpers: Map<symbol, Helper<any>> = new Map();

  public has(type: symbol) {
    return this.#helpers.has(type);
  }

  public regist<T>(type: symbol, creator: Helper<T>) {
    this.#helpers.set(type, creator);
  }

  public resolve(store: Store, key: string, type: symbol, payload) {
    const helper = this.#helpers.get(type);
    return helper(store, key, payload);
  }
}
