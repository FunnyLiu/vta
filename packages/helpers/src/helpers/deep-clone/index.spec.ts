import deepClone from "./index";

describe("deep-clone", () => {
  it("deep-clone-json", () => {
    const symAppid = Symbol("appid");
    const symCss = Symbol("css");
    const symImageName = Symbol("imageName");
    const source = {
      [symAppid]: "app-deep-clone",
      names: {
        js: "[name].js",
        [symCss]: "[name].css",
        images: [
          { type: "jpg", [symImageName]: "[name].jpg" },
          { type: "png", [symImageName]: "[name].png" },
        ],
      },
    };
    const target = deepClone(source);
    target[symAppid] = "app-deep-clone-cloned";
    target.names.js = "[hash].js";
    target.names.images[1][symImageName] = "[hash].png";

    expect(source[symAppid]).toBe("app-deep-clone");
    expect(target[symAppid]).toBe("app-deep-clone-cloned");
    expect(source.names.js).toBe("[name].js");
    expect(target.names.js).toBe("[hash].js");
    expect(source.names.images[1][symImageName]).toBe("[name].png");
    expect(target.names.images[1][symImageName]).toBe("[hash].png");
    expect(target.names[symCss]).toBe("[name].css");
    expect(target.names.images[0][symImageName]).toBe("[name].jpg");
  });
});
