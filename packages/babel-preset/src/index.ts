import { declare } from "@babel/helper-plugin-utils";
import { resolveConfig } from "vta";

export declare interface Options {
  env?: string;
}

export function vtaBabelPreset(options?: Options) {
  process.env.VTA_ENV = options?.env;
  const { presets = [], plugins = [] } = resolveConfig("babel") || {};
  return { presets, plugins };
}

export default declare((api: { assertVersion(ver: number): void }, options?: Options) => {
  api.assertVersion(7);
  return vtaBabelPreset(options);
});
