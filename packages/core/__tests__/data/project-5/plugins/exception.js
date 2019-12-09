module.exports = class ExceptionPlugin {
  constructor() {
    this.name = "exception";
  }

  /* eslint-disable class-methods-use-this */
  apply(app) {
    app.hooks.run.tap("exception", () => {
      throw new Error("Plugin Promise Exception");
    });
  }
};
