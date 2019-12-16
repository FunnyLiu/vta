module.exports = class FeatureTestPlugin {
  constructor() {
    this.name = "feature-test";
  }

  /* eslint-disable class-methods-use-this */
  prepare({ registFeature }) {
    registFeature("webpack");
    registFeature("react", { names: { js: "[hash].js", css: "[hash].js" } });
  }

  apply(app) {
    const webpackFeature = app.getFeature("webpack");
    const reactFeature = app.getFeature("react");
    const vueFeature = app.getFeature("vue");

    app.hooks.done.tap(this.name, () => {
      process.env.VTA_PROJECT_8_FEATURES = JSON.stringify({
        webpack: webpackFeature,
        react: reactFeature,
        vue: vueFeature,
      });
    });
  }
};
