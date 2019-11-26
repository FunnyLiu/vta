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

it("set-json-value-valid", () => {
  const jsonNULL = null;
  setJsonValue(jsonNULL, "appid", "react");
  expect(jsonNULL).toBe(null);

  const jsonObject = {};
  setJsonValue(jsonObject, "[0]", "react");
  expect(JSON.stringify(jsonObject)).toBe("{}");

  const jsonArray = [];
  setJsonValue(jsonArray, "appid", "react");
  expect(JSON.stringify(jsonArray)).toBe("[]");

  const jsonObjectFilter = {};
  setJsonValue(jsonObjectFilter, "[id=2]", "react");
  expect(JSON.stringify(jsonObjectFilter)).toBe("{}");
});

it("set-json-value", () => {
  setJsonValue(json, "appid", "set-json-value-modify");
  setJsonValue(json, "names.js", "[hash].js");
  setJsonValue(json, "names-unknown.js", "[hash].js");
  setJsonValue(json, "names.images[0]", { type: "png", name: "[hash].png" });
  setJsonValue(json, "names.images", ["typescript"], "push");
  setJsonValue(json, "presets[0][1].module", true);
  setJsonValue(json, "presets-unknown[0]", ["react"]);
  setJsonValue(json, "paths.entry", "index.js");
  setJsonValue(json, "plugins", ["transform-runtime"], "push");
  expect(json.appid).toBe("set-json-value-modify");
  expect(json.names.js).toBe("[hash].js");
  expect(json["names-unknown"].js).toBe("[hash].js");
  expect(json.names.images.length).toBe(3);
  expect((json.names.images[0] as any).name).toBe("[hash].png");
  expect((json.names.images[2] as any)[0]).toBe("typescript");
  expect((json.presets[0][1] as any).module).toBe(true);
  expect(json["presets-unknown"][0][0]).toBe("react");
  expect((json as any).paths.entry).toBe("index.js");
  expect((json as any).plugins.length).toBe(1);
  expect((json as any).plugins[0][0]).toBe("transform-runtime");
});

it("set-json-value-filter", () => {
  const items = [
    {
      plugins: [
        ["runtime", { modify: false }],
        ["import", { frame: "react", module: true, dir: "es-react" }],
        ["import", { frame: "react", module: false, dir: "lib-react" }],
        ["import", { frame: "vue", module: true, dir: "es-vue" }],
        ["import", { frame: "vue", module: false, dir: "lib-vue" }],
      ],
    },
  ];

  setJsonValue(items, '[0].plugins[[0]="runtime"][1]', { modify: true });
  setJsonValue(items, '[0].plugins[[[0]="import"][1].module=false][1].dir', "lib-react-modify");
  expect((items[0].plugins[0][1] as any).modify).toBe(true);
  expect((items[0].plugins[1][1] as any).dir).toBe("es-react");
  expect((items[0].plugins[2][1] as any).dir).toBe("lib-react-modify");
  expect((items[0].plugins[3][1] as any).dir).toBe("es-vue");
  expect((items[0].plugins[4][1] as any).dir).toBe("lib-vue");
});

it("set-json-value-mode", () => {
  const jsonMode = {
    replace: {
      env: "development",
      names: { js: "[name].js", css: "[name].css" },
    },
    merge: {
      env: "development",
      names: { js: "[name].js", css: "[name].css" },
    },
    "merge-deep": {
      env: "development",
      names: { js: "[name].js", css: "[name].css" },
    },
    push: ["7"],
    unshift: ["7"],
    insertBefore: [
      { id: "1", name: "1", type: "01" },
      { id: "2", name: "2", type: "01" },
      { id: "3", name: "3", type: "02" },
    ],
    insertAfter: [
      { id: "1", name: "1", type: "01" },
      { id: "2", name: "2", type: "01" },
      { id: "3", name: "3", type: "02" },
    ],
    delete: [
      { id: "1", name: "1", type: "01" },
      { id: "2", name: "2", type: "01" },
      { id: "3", name: "3", type: "02" },
    ],
  };

  setJsonValue(jsonMode, "replace", { env: "production" }, "replace");
  setJsonValue(jsonMode, "merge", { env: "production", names: { js: "[hash].js" } }, "merge");
  setJsonValue(jsonMode, "merge-unknown", { env: "production" }, "merge");
  setJsonValue(
    jsonMode,
    "merge-deep",
    { env: "production", names: { js: "[hash].js" } },
    "merge-deep",
  );
  setJsonValue(
    jsonMode,
    "merge-deep-unknown",
    { env: "production", names: { js: "[hash].js" } },
    "merge-deep",
  );
  setJsonValue(jsonMode, "push", "8", "push");
  setJsonValue(jsonMode, "push-unknown", "8", "push");
  setJsonValue(jsonMode, "unshift", "8", "unshift");
  setJsonValue(jsonMode, "unshift-unknown", "8", "unshift");
  setJsonValue(jsonMode, "insertBefore[3]", { id: "added-over", name: "added" }, "insert-before");
  setJsonValue(jsonMode, "insertBefore[1]", { id: "added", name: "added" }, "insert-before");
  setJsonValue(jsonMode, "insertAfter[3]", { id: "added-over", name: "added" }, "insert-after");
  setJsonValue(jsonMode, "insertAfter[1]", { id: "added", name: "added" }, "insert-after");
  setJsonValue(jsonMode, "delete[1]", undefined, "delete");

  expect(jsonMode.replace.env).toBe("production");
  expect(jsonMode.replace.names).toBe(undefined);
  expect(jsonMode.merge.env).toBe("production");
  expect(jsonMode.merge.names.js).toBe("[hash].js");
  expect(jsonMode.merge.names.css).toBe(undefined);
  expect(jsonMode["merge-unknown"].env).toBe("production");
  expect(jsonMode["merge-deep"].env).toBe("production");
  expect(jsonMode["merge-deep"].names.js).toBe("[hash].js");
  expect(jsonMode["merge-deep"].names.css).toBe("[name].css");
  expect(jsonMode["merge-deep-unknown"].env).toBe("production");
  expect(jsonMode.push[1]).toBe("8");
  expect(jsonMode["push-unknown"][0]).toBe("8");
  expect(jsonMode.unshift[0]).toBe("8");
  expect(jsonMode["unshift-unknown"][0]).toBe("8");
  expect(jsonMode.insertBefore.length).toBe(6);
  expect(jsonMode.insertBefore[1].id).toBe("added");
  expect(jsonMode.insertBefore[4].id).toBe("added-over");
  expect(jsonMode.insertBefore[5]).toBe(undefined);
  expect(jsonMode.insertAfter.length).toBe(6);
  expect(jsonMode.insertAfter[2].id).toBe("added");
  expect(jsonMode.insertAfter[4]).toBe(undefined);
  expect(jsonMode.insertAfter[5].id).toBe("added-over");
  expect(jsonMode.delete.length).toBe(2);
  expect(jsonMode.delete[1].id).toBe("3");
});

it("set-json-value-mode-filter", () => {
  const jsonMode = {
    mutate: [
      {
        id: "1",
        env: "development",
        names: { js: "[name].js", css: "[name].css" },
      },
      {
        id: "2",
        env: "development",
        names: { js: "[name].js", css: "[name].css" },
      },
      {
        id: "3",
        env: "development",
        names: { js: "[name].js", css: "[name].css" },
      },
    ],
    push: [
      { type: "1", ids: ["01", "02"] },
      { type: "2", ids: ["01", "02"] },
    ],
    insertBefore: [
      { id: "1", name: "1", type: "01" },
      { id: "2", name: "2", type: "02" },
      { id: "3", name: "3", type: "01" },
    ],
    insertAfter: [
      { id: "1", name: "1", type: "01" },
      { id: "2", name: "2", type: "02" },
      { id: "3", name: "3", type: "01" },
    ],
    delete: [
      { id: "1", name: "1", type: "01" },
      { id: "2", name: "2", type: "02" },
      { id: "3", name: "3", type: "01" },
    ],
  };

  setJsonValue(
    jsonMode,
    'mutate[id="1"]',
    { env: "production", names: { js: "[hash].js" } },
    "replace",
  );
  setJsonValue(
    jsonMode,
    'mutate[id="2"]',
    { env: "production", names: { js: "[hash].js" } },
    "merge",
  );
  setJsonValue(
    jsonMode,
    'mutate[id="3"]',
    { env: "production", names: { js: "[hash].js" } },
    "merge-deep",
  );
  setJsonValue(jsonMode, 'push[type="1"]', "03", "push");
  setJsonValue(jsonMode, 'push[type="1"].ids', "03", "push");
  setJsonValue(
    jsonMode,
    'insertBefore[type="01"]',
    { id: "added", name: "added" },
    "insert-before",
  );
  setJsonValue(jsonMode, 'insertAfter[type="01"]', { id: "added", name: "added" }, "insert-after");
  setJsonValue(jsonMode, 'delete[type="01"]', undefined, "delete");

  expect(jsonMode.mutate[0].id).toBe(undefined);
  expect(jsonMode.mutate[0].env).toBe("production");
  expect(jsonMode.mutate[1].id).toBe("2");
  expect(jsonMode.mutate[1].env).toBe("production");
  expect(jsonMode.mutate[1].names.js).toBe("[hash].js");
  expect(jsonMode.mutate[1].names.css).toBe(undefined);
  expect(jsonMode.mutate[2].id).toBe("3");
  expect(jsonMode.mutate[2].env).toBe("production");
  expect(jsonMode.mutate[2].names.js).toBe("[hash].js");
  expect(jsonMode.mutate[2].names.css).toBe("[name].css");
  expect(jsonMode.push.length).toBe(2);
  expect(jsonMode.push[0].ids.length).toBe(3);
  expect(jsonMode.push[0].ids[2]).toBe("03");
  expect(jsonMode.insertBefore.length).toBe(5);
  expect(jsonMode.insertBefore[0].id).toBe("added");
  expect(jsonMode.insertBefore[3].id).toBe("added");
  expect(jsonMode.insertAfter.length).toBe(5);
  expect(jsonMode.insertAfter[1].id).toBe("added");
  expect(jsonMode.insertAfter[4].id).toBe("added");
  expect(jsonMode.delete.length).toBe(1);
  expect(jsonMode.delete[0].id).toBe("2");
});
