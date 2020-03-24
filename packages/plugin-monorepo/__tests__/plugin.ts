import path from "path";
import fse from "fs-extra";
import { run } from "vta";
import resolvePackages from "../src/lib/resolve-packages";

jest.setTimeout(100000);

const cwd = path.resolve(__dirname, "./data/project");

it("resolve-packages", () => {
  const packages = resolvePackages(path.resolve(cwd, "modules"));
  expect(JSON.stringify(packages.map(({ pkg }) => pkg))).toBe('["module2","module1"]');
});

it("plugin-monorepo", () => {
  return Promise.all(
    ["module1", "module2"].map((pkg) => fse.remove(path.resolve(cwd, `modules/${pkg}/guid.txt`))),
  )
    .then(() => run({ cwd, silent: true }))
    .then(({ error: err }) => {
      expect(err).toBe(undefined);
      const store1 = JSON.parse(process.env.VTA_PLUGIN_MONOREPO_RECORD_STORE_1);
      expect(store1.runExists.module1).toBe(true);
      expect(store1.runExists.module2).toBe(true);
      expect(store1.doneExists.module1).toBe(false);
      expect(store1.doneExists.module2).toBe(false);
      expect(store1.options.module1.guid).toBe("e4eae524-3840-409d-9d50-080860a22c81");
      expect(store1.options.module2).toBe(null);
      const store2 = JSON.parse(process.env.VTA_PLUGIN_MONOREPO_RECORD_STORE_2);
      expect(store2.options.module1).toBe(null);
      expect(store2.options.module2.guid).toBe("02f838ea-df8e-4846-9469-5864a3546be1");
    });
});

it("plugin-monorepo-fail", () => {
  return run({ cwd: path.resolve(__dirname, "./data/project-fail"), silent: true }).then(
    ({ error: err }) => {
      expect(!!err).toBe(true);
      expect(err.message).toBe("package module1-failed build fail");
    },
  );
});
