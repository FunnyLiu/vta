const path = require("path");
const { default: tsc } = require("@vta/tsc");
const config = require("../config");
const resolvePackages = require("../../plugin-monorepo/src/lib/resolve-packages");
const copyFiles = require("../../plugin-monorepo/src/lib/copy-files");
const build = require("../../plugin-monorepo/src/lib/build");

const packages = resolvePackages(path.resolve(process.cwd(), "packages"));

const savePath = path.resolve(
  process.cwd(),
  `./node_modules/.cache/@vta/plugin-monorepo/copied-files-349ef87c-2f51-4714-8ede-1126352b0969.json`,
);
Promise.all([copyFiles(packages, config.filesCopyToPackages, process.cwd(), savePath)]).then(() =>
  build(packages, ({ pkg }) => {
    const options = config.tscOptionsBuilder(pkg);
    if (options) {
      return tsc(options);
    }
    return Promise.resolve();
  }),
);
