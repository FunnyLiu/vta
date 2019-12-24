const path = require("path");
const CopiedFilesStore = require("../utils/copied-files-store");
const testPkgMatched = require("../utils/test-pkg-matched");

/**
 * copy files
 * @param packages Array<{cwd:string,pkg:string}>
 * @param filesCopyToPackages Array<string|{src:string;dest?:string|((pkg:string)=>string);include?:RegExp;exclude?:RegExp;}>
 * @param cwd string current working directory
 * @param savePath string?
 * @returns Promise<{wipe:Promise<void>}>
 */
module.exports = function copyFiles(packages, filesCopyToPackages, cwd, savePath) {
  const copiedFilesStore = new CopiedFilesStore(cwd, savePath);
  filesCopyToPackages.forEach(fileOrOptions => {
    const options = typeof fileOrOptions === "string" ? { src: fileOrOptions } : fileOrOptions;
    packages.forEach(({ pkg, cwd: pCwd }) => {
      if (testPkgMatched(options.include, options.exclude, pkg)) {
        copiedFilesStore.add(
          path.resolve(cwd, options.src),
          path.resolve(
            pCwd,
            (typeof options.dest === "function" ? options.dest(pkg) : options.dest) || options.src,
          ),
        );
      }
    });
  });
  return copiedFilesStore.commit().then(
    () => copiedFilesStore,
    err => {
      return copiedFilesStore.wipe().then(() => {
        throw err;
      });
    },
  );
};
