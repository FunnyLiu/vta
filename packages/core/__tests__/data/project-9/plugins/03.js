module.exports = class Plugin03 {
  constructor(options) {
    this.name = "project-9-03";
    this.options = options;
  }

  apply(app) {
    app.hooks.done.tap(this.name, () => {
      process.env.VTA_CORE_PROJECT_9_03_GUID = this.options.guid;
    });
  }
};
