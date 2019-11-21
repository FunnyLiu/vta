import setJsonValue from "./index";

/* eslint-disable @typescript-eslint/no-explicit-any */

const json = {
  appid: "set-json-value",
  names: {
    js: "[name].js",
    css: "[name].css",
    images: [{ type: "png", name: "[name].png" }, ["env", { module: false }]],
  },
  presets: [
    ["env", { module: false }],
    ["react", { jsx: "jsx" }],
  ],
};

it("set-json-value", () => {
  setJsonValue(json, "appid", "set-json-value-modify");
  setJsonValue(json, "names.js", "[hash].js");
  setJsonValue(json, "names.images[0]", { type: "png", name: "[hash].png" });
  setJsonValue(json, "names.images[-1]", ["typescript"]);
  setJsonValue(json, "presets[0][1].module", true);
  setJsonValue(json, "paths.entry", "index.js");
  setJsonValue(json, "plugins[-1]", ["transform-runtime"]);
  expect(json.appid).toBe("set-json-value-modify");
  expect(json.names.js).toBe("[hash].js");
  expect(json.names.images.length).toBe(3);
  expect((json.names.images[0] as any).name).toBe("[hash].png");
  expect((json.names.images[2] as any)[0]).toBe("typescript");
  expect((json.presets[0][1] as any).module).toBe(true);
  expect((json as any).paths.entry).toBe("index.js");
  expect((json as any).plugins.length).toBe(1);
  expect((json as any).plugins[0][0]).toBe("transform-runtime");
});
