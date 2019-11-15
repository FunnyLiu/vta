/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
const runtimePackageJson = require("@babel/runtime/package.json");

module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        modules: "commonjs",
        useBuiltIns: "usage",
        corejs: 3,
        targets: {
          node: "10.16.0",
        },
      },
    ],
  ],
  plugins: [
    ["@babel/plugin-transform-runtime", { corejs: false, version: runtimePackageJson.version }],
  ],
};
