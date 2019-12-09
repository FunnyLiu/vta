import path from "path";
import appRun, { appRunSync } from "../src/core";

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
    appRunSync({ silent: false, cwd: path.resolve(__dirname, "data/project-3") }, err => {
      expect(!!err).toBe(true);
      expect(err.message.indexOf("cannot load plugin") >= 0).toBe(true);
    }));

  it("project-4-empty-plugins", () =>
    appRunSync({ silent: true, cwd: path.resolve(__dirname, "data/project-4") }, err => {
      expect(err).toBe(undefined);
    }));

  it("project-5-plugin-exception", () =>
    appRunSync({ silent: false, cwd: path.resolve(__dirname, "data/project-5") }, err => {
      expect(!!err).toBe(true);
      expect(err.message.indexOf("Plugin Promise Exception") >= 0).toBe(true);
    }));
});
