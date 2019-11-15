const chalk = require("chalk");
const { default: tsc } = require("@vta/tsc");

function tscBuildOneByOne([item, ...items]) {
  if (!item) return Promise.resolve();
  console.log(`\ntsc building ${chalk.yellow(`packages/${item.pkg}`)}`);
  return tsc(item.options).then(() => {
    return tscBuildOneByOne(items);
  });
}

module.exports = function build(packages, tscOptionsBuilder) {
  return tscBuildOneByOne(
    packages.map(pkg => ({ pkg, options: tscOptionsBuilder(pkg) })).filter(item => !!item.options),
  );
};
