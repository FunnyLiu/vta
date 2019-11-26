import { setJsonValue, SetJsonValueMode } from "@vta/helpers";
import { ConfigByHelper, Config } from "../engine/interface";
import { registHelper } from "../engine";

/* eslint-disable @typescript-eslint/no-explicit-any */

declare interface MutateOptions {
  path: string;
  value: any;
  mode?: SetJsonValueMode;
}

const TYPE = Symbol("config-helper-mutate");
export declare interface MutatePayload {
  items: MutateOptions[];
  cb?: (config: Config) => Config;
}

registHelper<MutatePayload>(TYPE, (store, key, payload) => {
  payload.items.forEach(item => {
    setJsonValue(store.getItem(key), item.path, item.value, item.mode);
  });
  return typeof payload.cb === "function" ? payload.cb(store.getItem(key)) : undefined;
});

/**
 * update the config by one options and return additional config by cb
 * @param options one options that post to vta/helpers/setJsonValue
 * @param cb receive config and return additional config
 */
function mutate(
  options: MutateOptions,
  cb?: (config: Config) => Config,
): ConfigByHelper<MutatePayload>;
/**
 * update the config by list of options and return additional config by cb
 * @param options  list of options that post to vta/helpers/setJsonValue
 * @param cb  receive config and return additional config
 */
function mutate(
  options: MutateOptions[],
  cb?: (config: Config) => Config,
): ConfigByHelper<MutatePayload>;

function mutate(options, cb) {
  const items = Array.isArray(options) ? options : [options];
  return { type: TYPE, payload: { items, cb } };
}

export default mutate;
