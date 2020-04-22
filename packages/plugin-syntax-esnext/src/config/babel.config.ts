import { useBase } from "@vta/config";
import resolveBabelRuntime from "./utils/resolve-babel-runtime";

export declare interface BabelConfig {
  presets: Array<string | [string, object?]>;
  plugins: Array<string | [string, object?]>;
}

/* eslint-disable global-require */
export default useBase(({ "@vta/syntax-esnext": vta }) => {
  const runtime = resolveBabelRuntime(vta.cwd);
  return {
    presets: [
      [
        require.resolve("@babel/preset-env"),
        {
          modules: vta.options.modules === false ? false : vta.options.modules,
          useBuiltIns: runtime.corejs ? "usage" : false,
          corejs: runtime.corejs,
        },
      ],
    ],
    plugins: [
      runtime.runtime
        ? [
            require.resolve("@babel/plugin-transform-runtime"),
            {
              useESModules: vta.options.modules === false,
              corejs: runtime.runtime.corejs,
              version: runtime.runtime.version,
            },
          ]
        : undefined,
    ].filter((plugin) => plugin),
  } as BabelConfig;
});
