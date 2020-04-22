import path from "path";
import { loadModuleSync } from "@vta/helpers";

/* eslint-disable global-require,import/no-dynamic-require */

function resolveVersion(packageJson, pkg: string): string {
  const version = (packageJson.dependencies || {})[pkg];
  if (!version) return null;
  return /^[^\d]*(\d+\.\d+\.\d+)[^\d]*/.exec(version)[1];
}

export declare type CoreJs = number | false;

export declare interface Runtime {
  runtime: { name: string; version: string; corejs: CoreJs };
  corejs: CoreJs;
}

export default function resolveBabelRuntime(cwd: string): Runtime {
  const packageJson = loadModuleSync(path.resolve(cwd, "./package.json"), {});

  const runtimes: Runtime[] = [
    {
      runtime: { name: "@babel/runtime-corejs3", version: "7.8.0", corejs: 3 },
      corejs: undefined,
    },
    {
      runtime: { name: "@babel/runtime-corejs2", version: "7.8.0", corejs: 2 },
      corejs: undefined,
    },
    {
      runtime: { name: "@babel/runtime", version: "7.8.0", corejs: false },
      corejs: undefined,
    },
    { runtime: null, corejs: undefined },
  ];
  let runtime: Runtime = runtimes[runtimes.length - 1];
  for (let i = 0, len = runtimes.length; i < len; i += 1) {
    if (runtimes[i].runtime) {
      const version = resolveVersion(packageJson, runtimes[i].runtime.name);
      if (version) {
        runtime = runtimes[i];
        runtime.runtime.version = version;
        break;
      }
    }
  }

  // use corejs only for @babel/runtime or non corejs runtime
  if ((runtime.runtime && runtime.runtime.corejs === false) || !runtime.runtime) {
    const corejsVersion = resolveVersion(packageJson, "core-js");
    if (corejsVersion) {
      runtime.corejs = parseInt(corejsVersion.split(".")[0], 10);
    }
  }
  return runtime;
}
