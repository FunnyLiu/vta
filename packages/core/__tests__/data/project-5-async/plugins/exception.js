module.exports = class ExceptionPlugin {
  constructor() {
    this.name = "exception";
  }

  /* eslint-disable class-methods-use-this */
  apply(app) {
    app.hooks.run.tap("exception", () => {
      throw new Error("Plugin Promise Exception");
    });

    app.hooks.exit.tap(this.name, err => {
      process.env.VTA_PROJECT_5_ASYNC_ERROR = err.message;
      throw new Error();
    });
  }
};
