import path from "path";
import { resolveConfig, registDir, mutate } from "../src";
import { setStoreExt, hooks } from "../src/engine";

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
      hooks.onConfigUserGetted(
        key,
        () => {
          processRecords.push(`${key}-user-getted`);
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
    setStoreExt("ts", category);
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
    const category = "hooks-merge-config";
    setStoreExt("ts", category);
    registDir(dir1, category);
    registDir(dir2, category);
    registDir(dir3, false, category);
    registDir(dir1, category);

    hooks.onConfigUserStart(
      "hooks",
      store => {
        expect(store.getItem("hooks").enableHooks.length).toBe(3);
        return mutate({ path: "enableHooks", value: "user-start", mode: "push" });
      },
      category,
    );
    hooks.onConfigUserGetted(
      "hooks",
      c => {
        expect(c.enableHooks.length).toBe(5);
        return mutate({ path: "enableHooks", value: "user-getted", mode: "push" });
      },
      category,
    );
    hooks.onConfigUserDone(
      "hooks",
      c => {
        expect(c.enableHooks.length).toBe(6);
        c.enableHooks.push("user-done");
      },
      category,
    );
    hooks.onConfigBaseStart(
      "hooks",
      store => {
        expect(store.getItem("hooks").enableHooks).toBe(undefined);
        return { enableHooks: ["base-start"] };
      },
      category,
    );
    hooks.onConfigBaseDone(
      "hooks",
      c => {
        expect(c.enableHooks.length).toBe(2);
        return { enableHooks: c.enableHooks.concat(["base-done"]) };
      },
      category,
    );

    const config = resolveConfig("hooks", category);

    expect(config.enableHooks.length).toBe(7);
    expect(JSON.stringify(config.enableHooks)).toBe(
      '["base-start","project-1","base-done","user-start","project-3","user-getted","user-done"]',
    );
  });
});
