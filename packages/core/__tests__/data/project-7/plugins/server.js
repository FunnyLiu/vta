module.exports = class ServerBuildPlugin {
  constructor() {
    this.name = "server-build-plugin";
  }

  apply(app) {
    app.hooks.done.tap("build-plugin", ({ resolveConfig }) => {
      const appConfig = resolveConfig("app");
      process.env.VTA_CORE_PROJECT_7_STORE = JSON.stringify({
        pluginName: this.name,
        appName: appConfig.name,
        srcDir: appConfig.dirs.src,
        buildDir: appConfig.dirs.build,
      });
    });
  }
};
