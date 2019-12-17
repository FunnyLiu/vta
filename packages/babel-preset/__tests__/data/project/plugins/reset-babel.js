const { mutate } = require("@vta/config"); // eslint-disable-line

module.exports = class ResetBabelPlugin {
  constructor() {
    this.name = "reset-babel-plugin";
  }

  /* eslint-disable class-methods-use-this */
  apply(app) {
    app.hooks.config.itemUserDone("babel", () =>
      mutate([
        { path: "presets", mode: "push", value: ["@babel/preset-react"] },
        {
          path: 'plugins[[0]="@babel/plugin-transform-runtime"][1]',
          mode: "merge-deep",
          value: { version: "7.7.6" },
        },
      ]),
    );
  }
};
