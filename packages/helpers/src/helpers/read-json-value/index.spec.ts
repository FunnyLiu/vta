import readJsonValue from "./index";

/* eslint-disable @typescript-eslint/no-explicit-any */

const json = {
  appid: "read-json-value",
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

it("read-json-value-key", () => {
  expect(readJsonValue(json, "appid")).toBe("read-json-value");
  expect(readJsonValue(json, "names.js")).toBe("[name].js");
  expect(readJsonValue<any[]>(json, "names.images").length).toBe(2);
  expect(readJsonValue(json, "presets.env")).toBe(undefined);
});

it("read-json-value-index", () => {
  expect(readJsonValue([1, 2, 3, 4], "[2]")).toBe(3);
  expect(readJsonValue(json, "names.images[0].name")).toBe("[name].png");
  expect(readJsonValue(json, "names.images[1][0]")).toBe("env");
  expect(readJsonValue(json, "names.images[1][1].module")).toBe(false);
  expect(readJsonValue(json, "presets[1][1].jsx")).toBe("jsx");
  expect(readJsonValue(json, "names[1]")).toBe(undefined);
});
