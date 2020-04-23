import path from "path";
import { resolveConfig } from "vta";

/* eslint-disable no-param-reassign */
function formatBabelPluginOrPreset(p) {
  if (typeof p === "string") {
    return path.relative(__dirname, p).replace(/\\/g, "/");
  }
  if (Array.isArray(p)) {
    p[0] = formatBabelPluginOrPreset(p[0]);
    return p;
  }
  return p;
}

function formatBabelConfig(babelConfig) {
  ["presets", "plugins"].forEach((c) => {
    babelConfig[c] = babelConfig[c].map((p) => formatBabelPluginOrPreset(p));
  });
  return babelConfig;
}

describe("plugin-syntax-esnext", () => {
  it("webpack", () => {
    process.env.VTA_JEST_TEST = "true";
    const babelConfig = resolveConfig("babel", path.resolve(__dirname, "./data/projects/webpack"));
    expect(JSON.stringify(formatBabelConfig(babelConfig), null, 2)).toMatchSnapshot();
  });
  it("node", () => {
    process.env.VTA_JEST_TEST = "true";
    const babelConfig = resolveConfig("babel", path.resolve(__dirname, "./data/projects/node"));
    expect(JSON.stringify(formatBabelConfig(babelConfig), null, 2)).toMatchSnapshot();
  });
});
