const path = require("path");
const chalk = require("chalk");

function buildOneByOne([item, ...items], builder, silent) {
  if (!item) return Promise.resolve();
  if (!silent) {
    console.log(`\nbuilding ${chalk.yellow(path.relative(process.cwd(), item.cwd))}`);
  }
  return builder(item).then((err) => {
    if (err) {
      throw err;
    }
    return buildOneByOne(items, builder, silent);
  });
}

/**
 * @param packages Array<{cwd:string,pkg:string,name:string}>
 * @param builder (pkg: {cwd:string,pkg:string,name:string}) => Promise<Error>;
 * @param silent dont print anything
 */
module.exports = function build(packages, builder, silent = false) {
  return buildOneByOne(packages, builder, silent);
};
