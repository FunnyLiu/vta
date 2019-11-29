import deepMerge from "./index";

describe("deep-merge", () => {
  it("target-null-undefined-empty", () => {
    expect(deepMerge({ appid: "0001" }, null).appid).toBe("0001");
    expect(deepMerge({ appid: "0001" }, undefined).appid).toBe("0001");
    expect(deepMerge({ appid: "0001" }, {}).appid).toBe("0001");
  });
  it("target-no-symbol", () => {
    const config = deepMerge(
      {
        appid: "0001",
        names: {
          js: "[name].js",
          css: "[name].css",
          image: { png: "[name].png", jpg: "[name].jpg" },
        },
        array: [0, 1, 2],
      },
      {
        appid: "0002",
        names: { js: "[hash].js", image: { jpg: "[hash].jpg" } },
        array: [3, 4, 5],
      },
    );

    expect(config.appid).toBe("0002");
    expect(config.names.js).toBe("[hash].js");
    expect(config.names.css).toBe("[name].css");
    expect(config.names.image.png).toBe("[name].png");
    expect(config.names.image.jpg).toBe("[hash].jpg");
    expect(JSON.stringify(config.array)).toBe("[3,4,5]");
  });
  it("target-symbol", () => {
    const symNames = Symbol("names");
    const symJs = Symbol("js");
    const config = deepMerge(
      {
        appid: "0001",
        [symNames]: {
          [symJs]: "[name].js",
          css: "[name].css",
        },
      },
      { appid: "0002", [symNames]: { [symJs]: "[hash].js" } },
    );
    expect(config.appid).toBe("0002");
    expect(config[symNames][symJs]).toBe("[hash].js");
    expect(config[symNames].css).toBe("[name].css");
  });
  it("merge-others", () => {
    const config = deepMerge(
      { names: { js: "[name].js", css: "[name].css" } },
      { names: { js: "[hash].js" } },
      { names: { css: "[hash].css" } },
    );

    expect(config.names.js).toBe("[hash].js");
    expect(config.names.css).toBe("[hash].css");
  });
});
