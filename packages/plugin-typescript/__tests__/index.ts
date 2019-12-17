import path from "path";
import fs from "fs";
import { run } from "vta";

jest.setTimeout(100000);

function loadFileContent(file: string): Promise<{ exists: boolean; content?: string }> {
  return new Promise(resolve => {
    fs.exists(file, resolve);
  }).then(exists => {
    if (exists) {
      return new Promise(contentResolve => {
        fs.readFile(file, "utf-8", (err, content) => {
          if (!err) {
            contentResolve({ exists: true, content });
          }
          contentResolve({ exists: false });
        });
      });
    }
    return { exists: false };
  });
}

describe("plugin-typescript", () => {
  it("project-typescript", () => {
    return run({ cwd: path.join(__dirname, "./data/project-typescript") })
      .then(({ error: err }) => {
        expect(err).toBe(undefined);
      })
      .then(() => loadFileContent(path.join(__dirname, "./data/project-typescript/dist/delay.js")))
      .then(({ exists, content }) => {
        expect(exists).toBe(true);
        expect(content).toMatchSnapshot("delay");
      })
      .then(() =>
        loadFileContent(path.join(__dirname, "./data/project-typescript/dist/delay.d.ts")),
      )
      .then(({ exists, content }) => {
        expect(exists).toBe(true);
        expect(content).toMatchSnapshot("delay.d");
      })
      .then(() =>
        loadFileContent(path.join(__dirname, "./data/project-typescript/dist/delay.spec.ts")),
      )
      .then(({ exists }) => {
        expect(exists).toBe(false);
      });
  });
  it("project-react", () => {
    return run({ cwd: path.join(__dirname, "./data/project-react") })
      .then(({ error: err }) => {
        expect(err).toBe(undefined);
      })
      .then(() => loadFileContent(path.join(__dirname, "./data/project-react/dist/Button.js")))
      .then(({ exists, content }) => {
        expect(exists).toBe(true);
        expect(content).toMatchSnapshot("button");
      })
      .then(() => loadFileContent(path.join(__dirname, "./data/project-react/dist/Button.d.ts")))
      .then(({ exists, content }) => {
        expect(exists).toBe(true);
        expect(content).toMatchSnapshot("button.d");
      });
  });
  it("project-webpack", () => {
    return run({ cwd: path.join(__dirname, "./data/project-webpack") })
      .then(({ error: err }) => {
        expect(err).toBe(undefined);
      })
      .then(() => loadFileContent(path.join(__dirname, "./data/project-webpack/dist/delay.js")))
      .then(({ exists }) => {
        expect(exists).toBe(false);
      });
  });
});
