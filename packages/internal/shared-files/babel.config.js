/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
const { resolveBabelRuntime } = require("@vta/internal");

const runtime = resolveBabelRuntime(__dirname);

module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        modules: "commonjs",
        useBuiltIns: "usage",
        corejs: runtime.installedCoreJs,
        targets: {
          node: "10.16.0",
        },
      },
    ],
  ],
  plugins: [
    ["@babel/plugin-transform-runtime", { corejs: runtime.corejs, version: runtime.version }],
    ["@babel/plugin-proposal-optional-chaining"],
  ],
};
