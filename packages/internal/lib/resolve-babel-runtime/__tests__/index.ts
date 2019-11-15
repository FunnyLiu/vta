import path from "path";
import resolveBabelRuntime from "../index";

describe("resolve-babel-runtime", () => {
  it("project-1", () => {
    const runtime = resolveBabelRuntime(path.resolve(__dirname, "data/project-1"));
    expect(runtime.runtime).toBe("@babel/runtime");
    expect(runtime.version).toBe("7.7.0");
    expect(runtime.corejs).toBe(false);
    expect(runtime.installedCoreJs).toBe(3);
  });
  it("project-2", () => {
    const runtime = resolveBabelRuntime(path.resolve(__dirname, "data/project-2"));
    expect(runtime.runtime).toBe("@babel/runtime-corejs3");
    expect(runtime.version).toBe("7.7.2");
    expect(runtime.corejs).toBe(3);
    expect(runtime.installedCoreJs).toBe(false);
  });
  it("project-3", () => {
    const runtime = resolveBabelRuntime(path.resolve(__dirname, "data/project-3"));
    expect(runtime.runtime).toBe("@babel/runtime");
    expect(runtime.version).toBe("7.7.0");
    expect(runtime.corejs).toBe(false);
    expect(runtime.installedCoreJs).toBe(false);
  });
});
