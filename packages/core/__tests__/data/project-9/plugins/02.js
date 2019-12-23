module.exports = class Plugin02 {
  constructor(options) {
    this.name = "project-9-02";
    this.options = options;
  }

  apply(app) {
    app.hooks.done.tap(this.name, () => {
      process.env.VTA_CORE_PROJECT_9_02_GUID = this.options.guid;
    });
  }
};
