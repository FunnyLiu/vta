import path from "path";
import { vtaBabelPreset as babelPreset } from "@vta/babel-preset"; // eslint-disable-line

it("babel-preset", () => {
  process.chdir(path.resolve(__dirname, "./data/project"));
  const config = babelPreset();
  expect(config.presets.length).toBe(2);
  expect(config.presets[1][0]).toBe("@babel/preset-react");
  expect(config.plugins[0][1].version).toBe("7.7.6");
});
