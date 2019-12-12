/* eslint-disable @typescript-eslint/no-explicit-any */
export declare interface Config {
  [key: string]: any;
}
export declare interface ConfigByHelper<T> {
  type: symbol;
  payload: T;
}

export declare type Helper<T> = (store: Store, key: string, payload: T) => any;

export declare interface Helpers {
  has(type: symbol): boolean;
  regist<T>(type: symbol, Helper: Helper<T>): void;
  resolve(store: Store, key: string, type: symbol, payload: any): any;
}

export declare type EventListener = (...args: any[]) => void;

export declare interface Events {
  on(type: string, listener: EventListener): void;
  emit(type: string, ...args: any[]): void;
}

export declare interface Store {
  /**
   * regist config dir. baseMode=false is always last one
   * @param dir config dir
   * @param baseMode user's config please set false. default true
   */
  registDir(dir: string, baseMode?: boolean): void;
  getItem(key: string): Config;
  load(key: string): Config;
  reset(): void;
  events: Events;
  helpers: Helpers;
}
