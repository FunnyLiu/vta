module.exports = class ServerBuildPlugin {
  constructor() {
    this.name = "server-build-plugin";
  }

  apply(app) {
    app.hooks.config.itemBaseStart("app", () => ({
      dirs: app.config.dirs,
    }));
    app.hooks.done.tap("build-plugin", ({ resolveConfig }) => {
      const appConfig = resolveConfig("app");
      process.env.VTA_CORE_PROJECT_7_STORE = JSON.stringify({
        pluginName: this.name,
        appName: appConfig.name,
        srcDir: appConfig.dirs.src,
        buildDir: appConfig.dirs.build,
        esnextModules: app.config.config.esnext.modules,
        typescriptJsx: app.config.config.typescript.jsx,
      });
    });
    app.hooks.exit.tap(this.name, () => {
      throw new Error();
    });
  }
};
