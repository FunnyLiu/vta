import path from "path";
import resolveBabelRuntime from "../src/config/utils/resolve-babel-runtime";

it("no-runtime", () => {
  const runtime = resolveBabelRuntime(
    path.resolve(__dirname, "./data/projects/resolve-babel-runtime/no-runtime"),
  );

  expect(runtime.runtime).toBe(null);
  expect(runtime.corejs).toBe(undefined);
});

it("no-runtime-corejs3", () => {
  const runtime = resolveBabelRuntime(
    path.resolve(__dirname, "./data/projects/resolve-babel-runtime/no-runtime-corejs3"),
  );

  expect(runtime.runtime).toBe(null);
  expect(runtime.corejs).toBe(3);
});

it("runtime", () => {
  const runtime = resolveBabelRuntime(
    path.resolve(__dirname, "./data/projects/resolve-babel-runtime/runtime"),
  );

  expect(runtime.runtime.name).toBe("@babel/runtime");
  expect(runtime.runtime.version).toBe("7.8.0");
  expect(runtime.runtime.corejs).toBe(false);
  expect(runtime.corejs).toBe(undefined);
});

it("runtime-corejs3", () => {
  const runtime = resolveBabelRuntime(
    path.resolve(__dirname, "./data/projects/resolve-babel-runtime/runtime-corejs3"),
  );

  expect(runtime.runtime.name).toBe("@babel/runtime-corejs3");
  expect(runtime.runtime.version).toBe("7.8.0");
  expect(runtime.runtime.corejs).toBe(3);
  expect(runtime.corejs).toBe(undefined);
});
