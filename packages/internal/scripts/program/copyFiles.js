const path = require("path");
const copiedFilesStore = require("../utils/copiedFilesStore");

function testPkgMatch(pattern, pkg) {
  if (typeof pattern === "string") {
    return new RegExp(pattern).test(pkg);
  }
  if (Object.prototype.toString.call(pattern) === "[object RegExp]") {
    return pattern.test(pkg);
  }
  return false;
}

module.exports = function copyFiles(packages, filesCopyToPackages, cwd = process.cwd()) {
  filesCopyToPackages.forEach(fileOrOptions => {
    const options = typeof fileOrOptions === "string" ? { src: fileOrOptions } : fileOrOptions;
    if (options.src) {
      const src = path.resolve(cwd, options.src);
      packages.forEach(pkg => {
        const needCopy = options.include ? testPkgMatch(options.include, pkg) : true;

        if (needCopy && !testPkgMatch(options.exclude, pkg)) {
          const dest =
            typeof options.dest === "function" ? options.dest(pkg) : options.dest || options.src;

          copiedFilesStore.add(src, path.resolve(cwd, `./packages/${pkg}/`, dest));
        }
      });
    }
  });
  return Promise.resolve();
};
