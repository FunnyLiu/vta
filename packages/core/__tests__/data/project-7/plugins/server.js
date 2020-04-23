module.exports = class ServerBuildPlugin {
  constructor() {
    this.name = "build-plugin";
  }

  apply(app) {
    const options = app.resolvePluginOptions(this);
    app.hooks.config.itemBaseStart("app", () => ({
      dirs: app.config.dirs,
    }));
    app.hooks.done.tap("build-plugin", ({ resolveConfig }) => {
      const appConfig = resolveConfig("app");
      process.env.VTA_CORE_PROJECT_7_STORE = JSON.stringify({
        pluginName: "server-build-plugin",
        appName: appConfig.name,
        srcDir: appConfig.dirs.src,
        buildDir: appConfig.dirs.build,
        esnextModules: options.esnext.modules,
        typescriptJsx: options.typescript.jsx,
      });
    });
    app.hooks.exit.tap(this.name, () => {
      throw new Error();
    });
  }
};
