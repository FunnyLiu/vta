module.exports = class LocaleBuildPlugin {
  constructor(options) {
    this.name = "build-plugin";
    this.options = options;
  }

  apply(app) {
    const options = app.resolvePluginOptions(this, {}, this.options);
    app.hooks.config.itemBaseStart("app", () => ({
      dirs: app.config.dirs,
    }));
    app.hooks.done.tap("build-plugin", ({ resolveConfig }) => {
      const appConfig = resolveConfig("app");
      process.env.VTA_CORE_PROJECT_7_STORE = JSON.stringify({
        pluginName: "locale-build-plugin",
        appName: appConfig.name,
        srcDir: appConfig.dirs.src,
        buildDir: appConfig.dirs.build,
        esnextModules: options.esnext.modules,
        typescriptJsx: options.typescript.jsx,
      });
    });
  }
};
