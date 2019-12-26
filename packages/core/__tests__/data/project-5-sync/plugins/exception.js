module.exports = class ExceptionPlugin {
  constructor() {
    this.name = "exception";
  }

  /* eslint-disable class-methods-use-this */
  apply(app) {
    app.hooks.config.init(() => {
      throw new Error("Plugin Sync Exception");
    });

    app.hooks.exit.tap(this.name, err => {
      process.env.VTA_PROJECT_5_SYNC_ERROR = err.message;
      throw new Error();
    });
  }
};
