import path from "path";
import { resolveConfig, registDir, mutate, hooks, reset } from "../src";
import { setStoreExt } from "../src/engine";

setStoreExt("ts");

const dir1 = path.resolve(__dirname, "./data/project-1/config");
const dir2 = path.resolve(__dirname, "./data/project-2/config");
const dir3 = path.resolve(__dirname, "./data/project-3/config");

describe("config", () => {
  it("hooks", () => {
    const category = "default";
    registDir(dir1);
    registDir(dir2);
    registDir(dir3, false);

    const processRecords = [];
    ["app", "env", "webpack", "webpack-server"].forEach(key => {
      hooks.onConfigBaseStart(
        key,
        () => {
          processRecords.push(`${key}-base-start`);
        },
        key === "app" ? category : undefined,
      );
      hooks.onConfigBaseDone(
        key,
        () => {
          processRecords.push(`${key}-base-done`);
        },
        key === "app" ? category : undefined,
      );
      hooks.onConfigUserStart(
        key,
        () => {
          processRecords.push(`${key}-user-start`);
        },
        key === "app" ? category : undefined,
      );
      hooks.onConfigUserDone(
        key,
        () => {
          processRecords.push(`${key}-user-done`);
        },
        key === "app" ? category : undefined,
      );
      hooks.onConfigDone(
        key,
        () => {
          processRecords.push(`${key}-done`);
        },
        key === "app" ? category : undefined,
      );
    });
    resolveConfig("env"); // env deps app
    resolveConfig("webpack"); // webpack deps app env webpack-server
    expect(JSON.stringify(processRecords, null, 2)).toMatchSnapshot();
  });

  it("use-base-udir-3", () => {
    const category = "use-base-udir-3";
    setStoreExt("ts", category);
    registDir(dir1, category);
    registDir(dir2, category);
    registDir(dir3, category);

    const appConfig = resolveConfig("app", category);
    expect(appConfig.appid).toBe("project-3");
    expect(appConfig.version).toBe("20191118-1-2-3");
    expect(appConfig.nonHelper.payload).toBe("non-helper");
    const pathsConfig = resolveConfig("paths", category);
    expect(pathsConfig.entry).toBe("./src/index.js");
  });

  it("use-base-udir-2", () => {
    const category = "use-base-udir-2";
    setStoreExt("ts", category);
    registDir(dir1, category);
    registDir(dir2, false, category);
    registDir(dir3, category);

    const appConfig = resolveConfig("app", category);
    expect(appConfig.appid).toBe("project-2");
    expect(appConfig.version).toBe("20191118-1-3-2");
  });

  it("wait-deps", () => {
    const category = "wait-deps";
    process.env.VTA_JEST_TEST = "true";
    registDir(dir1, category);
    registDir(dir2, category);
    registDir(dir3, false, category);

    const webpack = resolveConfig("webpack", category);
    const env = resolveConfig("env", category);
    expect(env.name).toBe("name-project-3");
    expect(env.remoteDev).toBe(true);
    expect(webpack.version).toBe("version-20191118-1-2-3");
    expect(webpack.remoteDev).toBe(true);
    expect(webpack.server.hot).toBe(true);
  });

  it("mutate", () => {
    const category = "mutate";
    setStoreExt("ts", category);
    registDir(dir1, category);
    registDir(dir2, category);
    registDir(dir3, false, category);

    const babel = resolveConfig("babel", category);

    expect(babel.presets.length).toBe(3);
    expect(babel.presets[1][0]).toBe("typescript");
    expect(babel.presetsLength).toBe(3);
    expect(babel.plugins.length).toBe(1);
    expect(babel.plugins[0][0]).toBe("transform-runtime");
  });

  it("use-value", () => {
    const category = "use-value";
    setStoreExt("ts", category);
    registDir(dir1, category);
    registDir(dir2, category);
    registDir(dir3, false, category);

    const useValue = resolveConfig("use-value", category);

    expect(useValue.baseDate).toBe("20191126");
    expect(useValue.version).toBe("20191118-1-2-3");
    expect(useValue.pluginName).toBe("transform-runtime");
  });

  it("hooks-merge-config", () => {
    process.env.NODE_ENV = "development";
    const category = "hooks-merge-config";
    setStoreExt("ts", category);
    registDir(dir1, category);
    registDir(dir2, category);
    registDir(dir3, false, category);
    registDir(dir1, category);

    hooks.onConfigUserStart(
      "hooks",
      (c, store) => {
        expect(store.getItem("hooks").enableHooks.length).toBe(3);
        return mutate({ path: "enableHooks", value: "user-start", mode: "push" });
      },
      category,
    );
    hooks.onConfigUserDone(
      "hooks",
      c => {
        expect(c.enableHooks.length).toBe(5);
        return mutate({ path: "enableHooks", value: "user-done", mode: "push" });
      },
      category,
    );
    hooks.onConfigDone(
      "hooks",
      c => {
        expect(c.enableHooks.length).toBe(6);
        c.enableHooks.push("done");
        return mutate({ path: "enableHooks", value: "done", mode: "push" });
      },
      category,
    );
    hooks.onConfigBaseStart(
      "hooks",
      store => {
        expect(store.getItem("hooks").enableHooks).toBe(undefined);
        return {
          env: {
            development: { enableHooks: ["base-start"] },
            production: { enableHooks: ["base-start-prod"] },
          },
        };
      },
      category,
    );
    hooks.onConfigBaseDone(
      "hooks",
      c => {
        expect(c.enableHooks.length).toBe(2);
        c.enableHooks.push("base-done");
      },
      category,
    );

    const config = resolveConfig("hooks", category);

    expect(config.enableHooks.length).toBe(7);
    expect(JSON.stringify(config.enableHooks)).toBe(
      '["base-start","project-1","base-done","user-start","project-3","user-done","done"]',
    );
  });

  it("use-env", () => {
    process.env.VTA_ENV = "production";
    const category = "use-env";
    setStoreExt("ts", category);
    registDir(dir1, category);
    registDir(dir2, category);
    registDir(dir3, false, category);

    const useEnv = resolveConfig("use-env", category);

    expect(useEnv.baseDate).toBe("20191126");
    expect(useEnv.version).toBe("20191118-1-2-3");
    expect(useEnv.pluginName).toBe("transform-runtime");
    expect(useEnv.mode).toBe("env-test-production");
    expect(useEnv.devMode).toBe(undefined);
    expect(useEnv.envBaseDate).toBe("20191126-prod");
    expect(useEnv.plugins.length).toBe(1);
    expect(useEnv.plugins[0]).toBe("react");
  });

  it("reset", () => {
    const category = "reset";
    setStoreExt("ts", category);
    registDir(dir1, category);
    registDir(dir2, category);
    registDir(dir3, false, category);

    hooks.onConfigBaseStart("reset", () => ({ name: "reset-test" }), category);

    const config1 = resolveConfig("reset", category);
    expect(config1.version.indexOf("20191212-1")).toBe(0);
    expect(config1.name).toBe("reset-test");
    reset(category);
    return new Promise(resolve => setTimeout(resolve, 1000)).then(() => {
      registDir(dir1, category);
      registDir(dir2, category);
      registDir(dir3, false, category);
      jest.resetModules();
      const config2 = resolveConfig("reset", category);
      expect(config2.version.indexOf("20191212-1")).toBe(0);
      expect(config2.version !== config1.version).toBe(true);
      expect(config2.name).toBe(undefined);
    });
  });
});
