import { ConfigByHelper, Config } from "../engine/interface";
import { registHelper } from "../engine";

const TYPE = Symbol("config-helper-use-base");
export declare type UseBasePayload = (config: Config) => Config;

registHelper<UseBasePayload>(TYPE, (store, key, payload) => {
  return payload(store.getItem(key));
});

/**
 * use base config and return additional config by cb
 * @param cb receive config and return additional config
 */
export default function useBase(cb: (config: Config) => Config): ConfigByHelper<UseBasePayload> {
  return { type: TYPE, payload: cb };
}
