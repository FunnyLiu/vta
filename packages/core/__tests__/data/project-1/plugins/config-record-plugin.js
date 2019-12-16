const path = require("path"); // eslint-disable-line
const AdditionalPlugin = require("./additional-plugin"); // eslint-disable-line

module.exports = class ConfigRecordPlugin {
  constructor(options) {
    this.options = options;
    this.name = "config-record";

    this.STORE = {
      processOrder: [],
      appConfig: {
        baseValue: null,
        value: null,
        userGuid: "",
        runGuid: "",
        doneGuid: "",
      },
    };
  }

  prepare(helpers) {
    this.STORE.processOrder.push("prepare");
    helpers.registPlugin(new AdditionalPlugin({ guid: "31131534-5e68-4b8d-96fa-757fbc2cc9b1" }));
  }

  apply(app) {
    const { STORE } = this;
    STORE.processOrder.push("apply");
    app.hooks.config.init(registDir => {
      registDir(path.resolve(__dirname, "../config-base"));
    });
    app.hooks.config.itemUserStart("app", () => {
      STORE.processOrder.push("hooks.config.app-user-start");
    });
    app.hooks.config.itemUserDone("app", appConfig => {
      STORE.processOrder.push("hooks.config.app-user-done");
      STORE.appConfig.userGuid = appConfig.guid;
      return { guid: this.options.guid };
    });
    app.hooks.config.itemBaseStart("app", () => {
      STORE.processOrder.push("hooks.config.app-base-start");
      return {
        dirs: app.config.dirs,
      };
    });
    app.hooks.config.itemBaseDone("app", appConfig => {
      STORE.processOrder.push("hooks.config.app-base-done");
      STORE.appConfig.baseValue = appConfig;
    });
    app.hooks.config.itemDone("app", () => {
      STORE.processOrder.push("hooks.config.app-done");
    });
    app.hooks.run.tapPromise("run", ({ resolveConfig }) => {
      STORE.processOrder.push("hooks.run");
      STORE.appConfig.runGuid = resolveConfig("app").guid;
      return Promise.resolve();
    });
    app.hooks.done.tap("done", ({ resolveConfig }) => {
      STORE.processOrder.push("hooks.done");
      STORE.appConfig.doneGuid = resolveConfig("app").guid;
      process.env.VTA_CONFIG_RECORD_PLUGIN_STORE = JSON.stringify(STORE);
    });
    app.hooks.ready.tap("ready", ({ resolveConfig }) => {
      STORE.processOrder.push("hooks.ready");
      STORE.appConfig.value = resolveConfig("app");
    });
  }
};
