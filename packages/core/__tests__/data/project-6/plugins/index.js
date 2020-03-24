module.exports = class Project6Plugin {
  constructor() {
    this.name = "project-6-plugin";
  }

  /* eslint-disable class-methods-use-this */
  apply(app) {
    const STORE = JSON.parse(process.env.VTA_CORE_PROJECT_6_STORE || "{}");
    STORE.process = STORE.process || [];
    STORE.versions = STORE.versions || [];
    STORE.process.push("apply");
    app.hooks.config.init(() => {
      STORE.process.push("config-init");
    });
    app.hooks.config.itemDone("app", () => {
      STORE.process.push("config-app-done");
    });
    app.hooks.ready.tap("ready", ({ resolveConfig }) => {
      STORE.process.push("ready");
      STORE.versions.push(resolveConfig("app").version);
    });
    app.hooks.run.tapPromise("run", () => {
      STORE.process.push("run");
      return new Promise((resolve) => {
        setTimeout(resolve, 3000);
      });
    });
    app.hooks.restart.tap("restart", () => {
      STORE.process.push("restart");
      process.env.VTA_CORE_PROJECT_6_STORE = JSON.stringify(STORE);
    });
    app.hooks.done.tap("done", () => {
      STORE.process.push("done");
    });
    app.hooks.exit.tap("exit", () => {
      process.env.VTA_CORE_PROJECT_6_STORE_VERSIONS = JSON.stringify(STORE.versions);
      STORE.versions = [];
      process.env.VTA_CORE_PROJECT_6_STORE = JSON.stringify(STORE);
      throw new Error("project-6 exit error");
    });
  }
};
