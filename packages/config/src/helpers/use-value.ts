import { readJsonValue } from "@vta/helpers";
import { ConfigByHelper, Config } from "../engine/interface";
import { registHelper } from "../engine";

/* eslint-disable @typescript-eslint/no-explicit-any */

const TYPE = Symbol("config-helper-use-value");
declare type ValuePath = string | { path: string; key: string };

export declare interface UseValuePayload {
  paths: ValuePath[];
  cb: (values: any[]) => Config;
}

registHelper<UseValuePayload>(TYPE, (store, key, payload) => {
  const values = [];
  payload.paths.forEach(path => {
    if (typeof path === "string") {
      values.push(readJsonValue(store.getItem(key), path));
    } else {
      const { key: dep } = path;
      store.load(dep);
      values.push(readJsonValue(store.getItem(dep), path.path));
    }
  });
  return payload.cb(values);
});

/**
 * use value of base or dependent by one path and return additional config by cb
 * @param path one path of base or dependent
 * @param cb receive value and return additional config
 */
function useValue<T, R = Config>(
  path: ValuePath,
  cb?: (value: T) => R,
): ConfigByHelper<UseValuePayload>;
/**
 * use value of base or dependent by path list and return additional config by cb
 * @param path list paths of base or dependent
 * @param cb  receive values and return additional config
 */
function useValue<T = any[], R = Config>(
  path: ValuePath[],
  cb?: (values: T) => R,
): ConfigByHelper<UseValuePayload>;

function useValue(path, cb) {
  const paths = Array.isArray(path) ? path : [path];
  return {
    type: TYPE,
    payload: {
      paths,
      cb(values) {
        if (Array.isArray(path)) {
          return cb(values);
        }
        return cb(values[0]);
      },
    },
  };
}

export default useValue;
