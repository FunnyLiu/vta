module.exports = class Plugin01 {
  constructor(options) {
    this.name = "project-9-01";
    this.options = options;
  }

  apply(app) {
    app.hooks.done.tap(this.name, () => {
      process.env.VTA_CORE_PROJECT_9_01_GUID = this.options.guid;
    });
  }
};
