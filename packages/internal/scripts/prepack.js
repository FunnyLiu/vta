const config = require("../config");
const copyFiles = require("./program/copyFiles");
const commitCopyFiles = require("./program/commitCopyFiles");
const build = require("./program/build");

Promise.all([copyFiles(config.packages, config.filesCopyToPackages)])
  .then(() => commitCopyFiles())
  .then(() => build(config.packages, config.tscOptionsBuilder));
