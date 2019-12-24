module.exports = class FailPlugin {
  constructor() {
    this.name = "fail-plugin";
  }

  /* eslint-disable class-methods-use-this */
  apply(app) {
    app.getFeature("monorepo").registBuilder(({ pkg }) => {
      return Promise.reject(new Error(`package ${pkg} build fail`));
    });
  }
};
