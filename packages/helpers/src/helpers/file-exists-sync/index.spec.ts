import path from "path";
import fileExistsSync from "./index";

it("file-exists-sync", () => {
  expect(fileExistsSync(path.resolve(__dirname, "./index.ts"))).toBe(true);
  expect(fileExistsSync(path.resolve(__dirname, "./index.d.ts"))).toBe(false);
});
