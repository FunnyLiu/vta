module.exports = class ConfigRecordPlugin {
  constructor(options) {
    this.name = "additional";
    this.options = options;
  }

  apply(app) {
    let getPlugin = null;
    app.hooks.init(helpers => {
      getPlugin = helpers.getPlugin;
    });
    app.hooks.done.tap("done", () => {
      process.env.VTA_ADDITIONAL_PLUGIN_GUID = this.options.guid;
      const registedPlugin = getPlugin("config-record");
      process.env.VTA_ADDITIONAL_PLUGIN_RECORD_GUID = registedPlugin
        ? registedPlugin.options.guid
        : "";
    });
  }
};
