const path = require("path");
const fse = require("fs-extra");
const packagesSortByDependencies = require("../utils/packages-sort-by-dependencies");

/**
 * resolve packages
 * @param cwd current working directory
 * @returns Array<{cwd:string,pkg:string,name:string}>
 */
module.exports = function resolvePackages(cwd) {
  const packagesWithDependencies = [];
  const pkgs = fse.readdirSync(cwd);
  for (let i = 0, len = pkgs.length; i < len; i += 1) {
    const pkg = pkgs[i];
    if (fse.statSync(path.resolve(cwd, pkg)).isDirectory()) {
      /* eslint-disable global-require,import/no-dynamic-require */
      /* eslint-disable @typescript-eslint/no-var-requires */
      const packageJson = require(path.resolve(cwd, pkg, "package.json"));
      if (packageJson.private !== true) {
        packagesWithDependencies.push({
          cwd: path.resolve(cwd, pkg),
          pkg,
          name: packageJson.name,
          dependencies: packageJson.dependencies,
          peerDependencies: packageJson.peerDependencies,
        });
      }
    }
  }
  return packagesSortByDependencies(packagesWithDependencies);
};
