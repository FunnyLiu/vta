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

it("read-json-value-filter", () => {
  const items = [
    { name: "001", age: 24 },
    { name: "002", age: 30 },
    { name: "003", age: 26 },
    { name: "004", age: 18 },
    { name: "005", age: 35 },
    { name: "006", age: 27 },
  ];

  expect(readJsonValue<typeof items>(items, "[age=24]").length).toBe(1);
  expect(readJsonValue<typeof items>(items, "[age!=24]").length).toBe(5);
  expect(readJsonValue<typeof items>(items, "[age>26]").length).toBe(3);
  expect(readJsonValue<typeof items>(items, "[age>26]")[1].name).toBe("005");
  expect(readJsonValue<typeof items>(items, "[age>=26]").length).toBe(4);
  expect(readJsonValue<typeof items>(items, "[age<24]").length).toBe(1);
  expect(readJsonValue<typeof items>(items, "[age<24]")[0].name).toBe("004");
  expect(readJsonValue<typeof items>(items, "[age<=24]").length).toBe(2);
});

it("read-json-value-filter-complex", () => {
  expect(readJsonValue(json, 'presets[[0]="env"][1].module')).toBe(false);
  expect(readJsonValue(json, 'names.images[type="png"].name')).toBe("[name].png");

  const items = [
    {
      plugins: [
        ["runtime", {}],
        ["import", { frame: "react", module: true, dir: "es-react" }],
        ["import", { frame: "react", module: false, dir: "lib-react" }],
        ["import", { frame: "vue", module: true, dir: "es-vue" }],
        ["import", { frame: "vue", module: false, dir: "lib-vue" }],
      ],
    },
  ];

  expect(
    readJsonValue(items, '[0].plugins[[0]="import",[1].frame="react",[1].module=false][1].dir'),
  ).toBe("lib-react");
  expect(readJsonValue(items, '[0].plugins[[[0]="import"][1].module=false][1].dir')).toBe(
    "lib-react",
  );
  expect(
    readJsonValue(items, '[0].plugins[[[[0]="import"][1].frame="vue"][1].module=false][1].dir'),
  ).toBe("lib-vue");

  const filtedItems = readJsonValue<[string, { frame: string; module: boolean; dir: string }][]>(
    items,
    '[0].plugins[[[0]="import"][1].frame="vue"]',
  );
  expect(filtedItems.length).toBe(2);
  expect(filtedItems[0][1].dir).toBe("es-vue");
  expect(filtedItems[1][1].dir).toBe("lib-vue");
});
