module.exports = class Plugin01 {
  constructor(options) {
    this.name = "project-6-root";
    this.options = options;
  }

  apply(app) {
    const STORE = JSON.parse(process.env.VTA_CORE_6_ROOT_STORE || "[]");
    app.hooks.run.tapPromise(this.name, ({ resolveConfig }) => {
      STORE.push({ guid: this.options.guid, timestamp: resolveConfig("timestamp").timestamp });
      return new Promise((resolve) => {
        setTimeout(resolve, 3000);
      });
    });
    app.hooks.restart.tap(this.name, () => {
      jest.resetModules();
      process.env.VTA_CORE_6_ROOT_STORE = JSON.stringify(STORE);
    });
    app.hooks.done.tap(this.name, () => {
      process.env.VTA_CORE_6_ROOT_STORE = JSON.stringify(STORE);
    });
  }
};
