module.exports = class ReactPlugin {
  constructor() {
    this.name = "react-plugin";
  }

  /* eslint-disable class-methods-use-this */
  prepare({ registFeature }) {
    registFeature("react", { jsx: "jsx", names: { js: "[name].js" } });
  }

  /* eslint-disable @typescript-eslint/no-empty-function */
  apply() {}
};
