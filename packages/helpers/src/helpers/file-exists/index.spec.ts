import path from "path";
import fileExists from "./index";

it("file-exists", () => {
  return fileExists(path.resolve(__dirname, "./index.ts"))
    .then(exists => {
      expect(exists).toBe(true);
    })
    .then(() => fileExists(path.resolve(__dirname, "./index.d.ts")))
    .then(exists => {
      expect(exists).toBe(false);
    });
});
