import { Config } from "@vta/config";
import { appRunSync } from "./index";

export default function resolveConfig<T = Config>(key: string, cwd = process.cwd()): T {
  let resolve;
  appRunSync({ cwd, dontRun: true }, (err, appResolveConfig) => {
    resolve = appResolveConfig;
  });
  if (typeof resolve === "function") {
    return resolve(key);
  }
  return undefined;
}
