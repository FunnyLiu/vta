module.exports = class ReactPlugin {
  constructor() {
    this.name = "react-plugin";
  }

  /* eslint-disable class-methods-use-this */
  prepare({ registFeature }) {
    registFeature("react");
  }

  /* eslint-disable @typescript-eslint/no-empty-function */
  apply() {}
};
