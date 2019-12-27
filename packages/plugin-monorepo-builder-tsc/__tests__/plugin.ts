import path from "path";
import { run } from "vta";
import { fileExistsSync } from "@vta/helpers"; // eslint-disable-line

jest.setTimeout(100000);

it("project", () => {
  return run({ cwd: path.resolve(__dirname, "./data/project"), silent: true }).then(
    ({ error: err }) => {
      expect(err).toBe(undefined);
      expect(
        fileExistsSync(
          path.resolve(path.resolve(__dirname, "./data/project/packages/module1/dist/delay.js")),
        ),
      ).toBe(true);
      expect(
        fileExistsSync(
          path.resolve(path.resolve(__dirname, "./data/project/packages/module1/dist/delay.d.ts")),
        ),
      ).toBe(true);
    },
  );
});

it("project-no-monorepo-plugin", () => {
  return run({
    cwd: path.resolve(__dirname, "./data/project-no-monorepo-plugin"),
    silent: true,
  }).then(({ error: err }) => {
    expect(err).toBe(undefined);
    expect(
      fileExistsSync(
        path.resolve(
          path.resolve(
            __dirname,
            "./data/project-no-monorepo-plugin/packages/module2/dist/delay.js",
          ),
        ),
      ),
    ).toBe(false);
    expect(
      fileExistsSync(
        path.resolve(
          path.resolve(
            __dirname,
            "./data/project-no-monorepo-plugin/packages/module2/dist/delay.d.ts",
          ),
        ),
      ),
    ).toBe(false);
  });
});

it("project-react", () => {
  return run({ cwd: path.resolve(__dirname, "./data/project-react"), silent: true }).then(
    ({ error: err }) => {
      expect(err).toBe(undefined);
      expect(
        fileExistsSync(
          path.resolve(
            path.resolve(__dirname, "./data/project-react/packages/module3/dist/delay.js"),
          ),
        ),
      ).toBe(true);
      expect(
        fileExistsSync(
          path.resolve(
            path.resolve(__dirname, "./data/project-react/packages/module3/dist/delay.d.ts"),
          ),
        ),
      ).toBe(true);
      expect(
        fileExistsSync(
          path.resolve(
            path.resolve(__dirname, "./data/project-react/packages/module3/dist/Button.js"),
          ),
        ),
      ).toBe(true);
      expect(
        fileExistsSync(
          path.resolve(
            path.resolve(__dirname, "./data/project-react/packages/module3/dist/Button.d.ts"),
          ),
        ),
      ).toBe(true);
    },
  );
});
