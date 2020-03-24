import { ConfigByHelper, Config } from "../engine/interface";
import { registHelper } from "../engine";

const TYPE = Symbol("config-helper-use-deps");
export declare interface UseDepsPayload {
  deps: string[];
  cb: (configs: Config[]) => Config;
}

registHelper<UseDepsPayload>(TYPE, (store, key, payload) => {
  payload.deps.forEach((dep) => {
    store.load(dep);
  });
  return payload.cb(payload.deps.map((dep) => store.getItem(dep)));
});

/**
 * use another key's config and return additional config by cb
 * @param dep dependent key
 * @param cb receive config and return additional config
 */
function useDeps<T = Config, R = Config>(
  dep: string,
  cb?: (config: T) => R,
): ConfigByHelper<UseDepsPayload>;
/**
 * use another key's config and return additional config by cb
 * @param deps dependent keys
 * @param cb  receive config and return additional config
 */
function useDeps<T = Config[], R = Config>(
  deps: string[],
  cb?: (configs: T) => R,
): ConfigByHelper<UseDepsPayload>;

function useDeps(depOrDeps, cb) {
  const deps = Array.isArray(depOrDeps) ? depOrDeps : [depOrDeps];
  return {
    type: TYPE,
    payload: {
      deps,
      cb(configs) {
        if (Array.isArray(depOrDeps)) {
          return cb(configs);
        }
        return cb(configs[0]);
      },
    },
  };
}

export default useDeps;
