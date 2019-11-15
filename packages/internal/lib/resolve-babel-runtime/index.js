const path = require("path");

/* eslint-disable global-require,import/no-dynamic-require */

function resolveVersion(packageJson, pkg) {
  const version = packageJson.dependencies[pkg];
  if (!version) return null;
  const matches = /^[^\d]*(\d+\.\d+\.\d+)[^\d]*/.exec(version);
  if (matches) {
    return matches[1];
  }
  return null;
}

module.exports = function resolveBabelRuntime(dirname) {
  const packageJson = require(path.resolve(dirname, "./package.json"));

  const runtimes = [
    { runtime: "@babel/runtime-corejs3", version: "7.0.0", corejs: 3, installedCoreJs: false },
    { runtime: "@babel/runtime-corejs2", version: "7.0.0", corejs: 2, installedCoreJs: false },
    { runtime: "@babel/runtime", version: "7.0.0", corejs: false, installedCoreJs: false },
  ];
  let runtime = null;
  for (let i = 0, len = runtimes.length; i < len; i += 1) {
    const version = resolveVersion(packageJson, runtimes[i].runtime);
    if (version) {
      runtime = runtimes[i];
      runtime.version = version;
      break;
    }
  }

  if (runtime.corejs === false) {
    const corejsVersion = resolveVersion(packageJson, "core-js");
    if (corejsVersion) {
      runtime.installedCoreJs = parseInt(corejsVersion.split(".")[0], 10);
    } else {
      runtime.installedCoreJs = false;
    }
  } else {
    runtime.installedCoreJs = false;
  }
  return runtime;
};
