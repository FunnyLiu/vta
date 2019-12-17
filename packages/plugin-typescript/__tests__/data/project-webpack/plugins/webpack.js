module.exports = class WebpackPlugin {
  constructor() {
    this.name = "wepback-plugin";
  }

  /* eslint-disable class-methods-use-this */
  prepare({ registFeature }) {
    registFeature("webpack");
  }

  /* eslint-disable @typescript-eslint/no-empty-function */
  apply() {}
};
