const path = require("path");

const cwd = process.cwd();

module.exports = {
  /**
   * files that need to copy to packages,the copied file path is relatived to the root dir
   * Array Of string or object has the below keys
   *   src: the copied file path
   *   dest: rename the file or (pkg:string)=>string
   *   include: the regexp to test the pkg to include
   *   exclude: the regexp to test the pkg to exclude
   */
  filesCopyToPackages: ["LICENSE"].concat(
    [".npmignore", "tsconfig.build.json", "babel.config.js"].map((src) => ({
      src: `./packages/internal/shared-files/${src}`,
      dest: src,
    })),
  ),
  /**
   * get the @vta/tsc options to build the package
   * @param {*} pkg package name. eg helper
   * return null/undefined if not build by @vta/tsc
   * options see https://github.com/vta-js/tsc#options
   */
  tscOptionsBuilder(pkg) {
    return {
      project: "tsconfig.build.json",
      exclude: ["**/*.{spec,test}.ts", "**/__tests__/**/*.*"],
      cwd: path.resolve(cwd, `./packages/${pkg}`),
    };
  },
};
