import path from "path";
import appRun from "../src/core";

/* eslint-disable */
describe("vta-engine", () => {
  it("project-1", () =>
    appRun({ silent: true, cwd: path.resolve(__dirname, "data/project-1") }).then(err => {
      expect(err).toBe(undefined);
      expect(
        JSON.stringify(JSON.parse(process.env.VTA_CONFIG_RECORD_PLUGIN_STORE), null, 2),
      ).toMatchSnapshot("config_record_plugin");
      expect(process.env.VTA_ADDITIONAL_PLUGIN_GUID).toBe("31131534-5e68-4b8d-96fa-757fbc2cc9b1");
      expect(process.env.VTA_ADDITIONAL_PLUGIN_RECORD_GUID).toBe(
        "905365f0-e49b-49bc-afe7-7550e46297bb",
      );
    }));

  it("project-2-invalid-vta-config", () =>
    appRun({ silent: true, cwd: path.resolve(__dirname, "data/project-2") }).then(err => {
      expect(!!err).toBe(true);
      expect(err.message.indexOf("cannot load vta config file") >= 0).toBe(true);
    }));

  it("project-3-invalid-plugin", () =>
    appRun({ silent: false, cwd: path.resolve(__dirname, "data/project-3") }).then(err => {
      expect(!!err).toBe(true);
      expect(err.message.indexOf("cannot load plugin") >= 0).toBe(true);
    }));

  it("project-4-empty-plugins", () =>
    appRun({ silent: true, cwd: path.resolve(__dirname, "data/project-4") }).then(err => {
      expect(err).toBe(undefined);
    }));
});
