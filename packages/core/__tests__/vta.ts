import path from "path";
import fs from "fs";
import appRun, { appRunSync } from "../src/core";
import resolveConfig from "../src/core/resolveConfig";

/* eslint-disable */
describe("vta-engine", () => {
  it("project-1", () => {
    process.chdir(path.resolve(__dirname, "data/project-1"));
    appRun().then(({ error: err }) => {
      expect(err).toBe(undefined);
      expect(
        JSON.stringify(JSON.parse(process.env.VTA_CONFIG_RECORD_PLUGIN_STORE), null, 2),
      ).toMatchSnapshot("config_record_plugin");
      expect(process.env.VTA_ADDITIONAL_PLUGIN_GUID).toBe("31131534-5e68-4b8d-96fa-757fbc2cc9b1");
      expect(process.env.VTA_ADDITIONAL_PLUGIN_RECORD_GUID).toBe(
        "905365f0-e49b-49bc-afe7-7550e46297bb",
      );
    });
  });

  it("project-2-invalid-vta-config", () =>
    appRunSync({ silent: true, cwd: path.resolve(__dirname, "data/project-2") }, err => {
      expect(!!err).toBe(true);
      expect(err.message.indexOf("cannot load vta config file") >= 0).toBe(true);
    }));

  it("project-3-invalid-plugin", () =>
    appRun({ silent: true, cwd: path.resolve(__dirname, "data/project-3") }).then(
      ({ error: err }) => {
        expect(!!err).toBe(true);
        expect(err.message.indexOf("cannot load plugin") >= 0).toBe(true);
      },
    ));

  it("project-4-empty-plugins", () =>
    appRun({ silent: true, cwd: path.resolve(__dirname, "data/project-4") }).then(
      ({ error: err }) => {
        expect(err).toBe(undefined);
      },
    ));

  it("project-5-plugin-exception", () =>
    appRun({ silent: true, cwd: path.resolve(__dirname, "data/project-5") }).then(
      ({ error: err }) => {
        expect(!!err).toBe(true);
        expect(err.message.indexOf("Plugin Promise Exception") >= 0).toBe(true);
      },
    ));

  it("project-6-restart", () => {
    process.env.NODE_ENV = "development";
    setTimeout(() => {
      fs.writeFileSync(
        path.resolve(__dirname, "data/project-6/config/01.temp.js"),
        "module.exports = {};",
      );
    }, 1000);
    return appRun({ silent: true, cwd: path.resolve(__dirname, "data/project-6") }).then(
      ({ error: err }) => {
        expect(err).toBe(undefined);
        expect(
          JSON.stringify(JSON.parse(process.env.VTA_CORE_PROJECT_6_STORE), null, 2),
        ).toMatchSnapshot("restart");
        const versions = JSON.parse(process.env.VTA_CORE_PROJECT_6_STORE_VERSIONS);
        expect(versions.length).toBe(2);
        expect(versions[0].indexOf("20191212-1")).toBe(0);
        expect(versions[1].indexOf("20191212-1")).toBe(0);
      },
    );
  });
});

describe("resolve-config", () => {
  it("project-1", () => {
    process.chdir(path.resolve(__dirname, "data/project-1"));
    const appConfig = resolveConfig("app");
    expect(appConfig.dirs.config).toBe("config-1");
    expect(appConfig.dirs.src).toBe("src");
    expect(appConfig.name).toBe("project-1");
    expect(appConfig.version).toBe("1.0.0");
    expect(appConfig.guid).toBe("905365f0-e49b-49bc-afe7-7550e46297bb");
  });

  it("project-3", () => {
    process.chdir(path.resolve(__dirname, "data/project-3"));
    const appConfig = resolveConfig("app");
    expect(appConfig).toBe(undefined);
  });
});
