module.exports = class ConfigRecordPlugin {
  constructor(options) {
    this.name = "additional";
    this.options = options;
    this.getPlugin = null;
  }

  prepare(helpers) {
    this.getPlugin = helpers.getPlugin;
  }

  apply(app) {
    app.hooks.done.tap("done", () => {
      process.env.VTA_ADDITIONAL_PLUGIN_GUID = this.options.guid;
      const registedPlugin = this.getPlugin("config-record");
      process.env.VTA_ADDITIONAL_PLUGIN_RECORD_GUID = registedPlugin
        ? registedPlugin.options.guid
        : "";
    });
  }
};
