import path from "path";
import fse from "fs-extra"; // eslint-disable-line
import { run, runSync, resolveConfig } from "vta"; // eslint-disable-line

/* eslint-disable */
describe("vta-engine", () => {
  it("project-1", () => {
    process.chdir(path.resolve(__dirname, "data/project-1"));
    return run({
      config: "./.vta.js",
      arguments: "--no-push --bl-true TRUE --bl-false False --plugins @vta/typescript,@vta/react --color".split(
        " ",
      ),
    }).then(({ error: err }) => {
      expect(err).toBe(undefined);
      expect(
        JSON.stringify(JSON.parse(process.env.VTA_CONFIG_RECORD_PLUGIN_STORE), null, 2),
      ).toMatchSnapshot("config_record_plugin");
      expect(process.env.VTA_ADDITIONAL_PLUGIN_GUID).toBe("31131534-5e68-4b8d-96fa-757fbc2cc9b1");
      expect(process.env.VTA_ADDITIONAL_PLUGIN_RECORD_GUID).toBe(
        "905365f0-e49b-49bc-afe7-7550e46297bb",
      );

      const args = JSON.parse(process.env.VTA_ARGUMENT_RECORD_ARGS);
      expect(args["no-push"]).toBe(true);
      expect(args.unknown).toBe(undefined);
      expect(args["bl-true"]).toBe(true);
      expect(args["bl-false"]).toBe(false);
      expect(args.plugins).toBe("@vta/typescript,@vta/react");
      expect(args.color).toBe(true);
    });
  });

  it("project-2-invalid-vta-config", () =>
    runSync({ silent: true, cwd: path.resolve(__dirname, "data/project-2") }, err => {
      expect(!!err).toBe(true);
      expect(err.message.indexOf("cannot load vta config file") >= 0).toBe(true);
    }));

  it("project-3-invalid-plugin", () =>
    run({ silent: true, cwd: path.resolve(__dirname, "data/project-3") }).then(({ error: err }) => {
      expect(!!err).toBe(true);
      expect(err.message.indexOf("cannot load plugin") >= 0).toBe(true);
    }));

  it("project-4-empty-plugins", () =>
    run({ silent: true, cwd: path.resolve(__dirname, "data/project-4") }).then(({ error: err }) => {
      expect(err).toBe(undefined);
    }));

  it("project-5-plugin-exception", () =>
    run({ silent: true, cwd: path.resolve(__dirname, "data/project-5") }).then(({ error: err }) => {
      expect(!!err).toBe(true);
      expect(err.message.indexOf("Plugin Promise Exception") >= 0).toBe(true);
      expect(process.env.VTA_PROJECT_5_ERROR).toBe("Plugin Promise Exception");
    }));

  it("project-5-async-plugin-exception", () =>
    run({ silent: true, cwd: path.resolve(__dirname, "data/project-5-async") }).then(
      ({ error: err }) => {
        expect(!!err).toBe(true);
        expect(err.message.indexOf("Plugin Promise Exception") >= 0).toBe(true);
        expect(process.env.VTA_PROJECT_5_ASYNC_ERROR).toBe("Plugin Promise Exception");
      },
    ));

  it("project-5-sync-plugin-exception", () =>
    run({ silent: true, cwd: path.resolve(__dirname, "data/project-5-sync") }).then(
      ({ error: err }) => {
        expect(!!err).toBe(true);
        expect(err.message.indexOf("Plugin Sync Exception") >= 0).toBe(true);
        expect(process.env.VTA_PROJECT_5_SYNC_ERROR).toBe("Plugin Sync Exception");
      },
    ));

  it("project-6-restart", () => {
    process.env.NODE_ENV = "development";
    setTimeout(() => {
      fse.writeFileSync(
        path.resolve(__dirname, "data/project-6/config/01.temp.js"),
        "module.exports = {};",
      );
    }, 1000);
    return run({ silent: true, cwd: path.resolve(__dirname, "data/project-6") }).then(
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

  it("project-6-restart-root", () => {
    process.env.NODE_ENV = "development";
    fse.ensureDirSync(path.resolve(__dirname, "data/project-6-root/dist"));
    const writeRootConfig = guid => {
      fse.writeFileSync(
        path.resolve(__dirname, "data/project-6-root/dist/vta.js"),
        `module.exports = {plugins:[["../plugins",{"guid":"${guid}"}]]};`,
      );
    };
    writeRootConfig("994321ef-3a35-4b32-9baf-62420c9fb1e0");
    setTimeout(() => {
      writeRootConfig("f0cb95a3-5920-4f00-b460-13e8c4a57d1c");
    }, 1000);
    return run({
      silent: true,
      cwd: path.resolve(__dirname, "data/project-6-root"),
      config: "./dist/vta.js",
    }).then(({ error: err }) => {
      expect(err).toBe(undefined);
      const store = JSON.parse(process.env.VTA_CORE_6_ROOT_STORE);
      expect(store.length).toBe(2);
      expect(store[0].guid).toBe("994321ef-3a35-4b32-9baf-62420c9fb1e0");
      expect(store[1].guid).toBe("f0cb95a3-5920-4f00-b460-13e8c4a57d1c");
      expect(store[0].timestamp === store[1].timestamp).toBe(false);
    });
  });

  it("project-7-env-locale", () => {
    process.env.VTA_ENV = "locale";
    return run({ silent: true, cwd: path.resolve(__dirname, "data/project-7") }).then(
      ({ error: err }) => {
        expect(err).toBe(undefined);
        const store = JSON.parse(process.env.VTA_CORE_PROJECT_7_STORE);
        expect(store.pluginName).toBe("locale-build-plugin");
        expect(store.appName).toBe("app-name-locale");
        expect(store.srcDir).toBe("source-code");
        expect(store.buildDir).toBe("dist-locale");
      },
    );
  });

  it("project-7-env-server", () => {
    delete process.env.VTA_ENV;
    process.env.NODE_ENV = "server";
    jest.resetModules();
    return run({ silent: true, cwd: path.resolve(__dirname, "data/project-7") }).then(
      ({ error: err }) => {
        expect(err).toBe(undefined);
        const store = JSON.parse(process.env.VTA_CORE_PROJECT_7_STORE);
        expect(store.pluginName).toBe("server-build-plugin");
        expect(store.appName).toBe("app-name-server");
        expect(store.srcDir).toBe("source-code");
        expect(store.buildDir).toBe("dist-server");
      },
    );
  });

  it("project-8-feature", () =>
    run({ silent: true, cwd: path.resolve(__dirname, "data/project-8") }).then(({ error: err }) => {
      expect(err).toBe(undefined);
      const features = JSON.parse(process.env.VTA_PROJECT_8_FEATURES);
      expect(JSON.stringify(features.webpack)).toBe("{}");
      expect(features.react.jsx).toBe("jsx");
      expect(features.react.names.js).toBe("[name].js");
      expect(features.react.names.css).toBe("[hash].js");
      expect(features.vue).toBe(null);
    }));

  it("project-9-preset", () =>
    run({ silent: true, cwd: path.resolve(__dirname, "data/project-9") }).then(({ error: err }) => {
      expect(err).toBe(undefined);
      expect(process.env.VTA_CORE_PROJECT_9_01_GUID).toBe("B5E8F28B-46F8-60B7-5FD3-8B741C034A08");
      expect(process.env.VTA_CORE_PROJECT_9_02_GUID).toBe("910B0D72-0281-F757-C1C9-566BA46F5FE0");
      expect(process.env.VTA_CORE_PROJECT_9_03_GUID).toBe("09CE5790-9CE8-8AD5-3FBC-6AC3BDED0697");
    }));

  it("project-10-invalid-preset", () =>
    run({ silent: true, cwd: path.resolve(__dirname, "data/project-10") }).then(
      ({ error: err }) => {
        expect(!!err).toBe(true);
        expect(err.message.indexOf("cannot load preset") >= 0).toBe(true);
      },
    ));
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
