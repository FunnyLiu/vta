import { ConfigByHelper, Config } from "../engine/interface";
import { registHelper } from "../engine";

const TYPE = Symbol("config-helper-use-deps");
export declare interface UseDepsPayload {
  deps: string[];
  cb: (configs: Config[]) => Config;
}

registHelper<UseDepsPayload>(TYPE, (store, key, payload) => {
  payload.deps.forEach(dep => {
    store.events.on(`config-${dep}-user-done`, () => {});
    store.load(dep);
  });
  return payload.cb(payload.deps.map(dep => store.getItem(dep)));
});

/**
 * use another key's config and return additional config by cb
 * @param dep dependent key
 * @param cb receive config and return additional config
 */
function useDeps(dep: string, cb?: (config: Config) => Config): ConfigByHelper<UseDepsPayload>;
/**
 * use another key's config and return additional config by cb
 * @param deps dependent keys
 * @param cb  receive config and return additional config
 */
function useDeps(
  deps: string[],
  cb?: (configs: Config[]) => Config,
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
