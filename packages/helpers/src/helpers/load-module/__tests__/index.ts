import path from "path";
import loadModule from "../index";

const DATA = {
  js: "b0a4b7cd-22dd-44da-9cab-d403a7d1dad0",
  es: "69520e31-b632-4711-9aeb-cdec289e7c45",
  json: "9c0ebf53-8be7-4452-b200-bfb31a6829ea",
  inSub: "2cd7b9bd-db32-45dc-ae09-33a37830fb26",
  def404: "025f274d-ca11-4d04-b5ad-28954471a863",
};

declare interface Config {
  appid: string;
}

describe("load-module", () => {
  it("load-module-js", () =>
    loadModule<Config>(path.resolve(__dirname, "./data/config.js")).then(config => {
      expect(config.appid).toBe(DATA.js);
    }));

  it("load-module-es", () =>
    loadModule<Config>(path.resolve(__dirname, "./data/config.module.ts")).then(config => {
      expect(config.appid).toBe(DATA.es);
    }));

  it("load-module-json", () =>
    loadModule<Config>(path.resolve(__dirname, "./data/config.json")).then(config => {
      expect(config.appid).toBe(DATA.json);
    }));

  it("load-module-in-sub", () =>
    loadModule<Config>(path.resolve(__dirname, "./data/config-in-sub")).then(config => {
      expect(config.appid).toBe(DATA.inSub);
    }));

  it("load-module-404", () =>
    loadModule<Config>(path.resolve(__dirname, "./data/config.404.js")).then(config => {
      expect(config).toBe(undefined);
    }));

  it("load-module-404-default", () =>
    loadModule<Config>(path.resolve(__dirname, "./data/config.404.js"), {
      appid: DATA.def404,
    }).then(config => {
      expect(config.appid).toBe(DATA.def404);
    }));
});
