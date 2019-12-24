import path from "path";
import { Plugin, App, PrepareHelpers } from "vta";
import { Options, FeatureOptions, Builder, BuilderOptions, Pkg } from "./interface";
import resolvePackages from "./lib/resolve-packages";
import copyFiles from "./lib/copy-files";
import build from "./lib/build";
import testPkgMatched from "./utils/test-pkg-matched";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default class MonorepoPlugin extends Plugin {
  constructor(options: Options = {}) {
    super("@vta/plugin-monorepo");
    this.options = options;
  }

  private options: Options;

  private builders: Map<Builder, BuilderOptions> = new Map<Builder, BuilderOptions>();

  private registBuilder(builder: Builder, options: BuilderOptions) {
    this.builders.set(builder, options);
  }

  prepare(helpers: PrepareHelpers) {
    helpers.registFeature<FeatureOptions>("monorepo", {
      registBuilder: this.registBuilder.bind(this),
    });
  }

  apply(app: App) {
    let packages: Pkg[];
    app.hooks.run.tapPromise(`${this.name}-resolve-packages`, () => {
      packages = resolvePackages(path.resolve(app.cwd, this.options.packages || "packages"));
      return Promise.resolve();
    });
    let wipeCopiedFiles;
    app.hooks.run.tapPromise(`${this.name}-copy-files`, () => {
      const { filesToCopy = [] } = this.options;
      return copyFiles(packages, filesToCopy, app.cwd).then(store => {
        wipeCopiedFiles = store.wipe;
      });
    });
    app.hooks.run.tapPromise(`${this.name}-build`, () => {
      const buildOptions = new Map<
        string,
        Array<{ builder: Builder; options: { [key: string]: any } }>
      >();
      packages.forEach(p => {
        buildOptions.set(p.pkg, []);
        this.builders.forEach((options, builder) => {
          if (testPkgMatched(options?.include, options?.exclude, p.pkg)) {
            buildOptions.get(p.pkg).push({ builder, options: options?.options });
          }
        });
      });
      return build(
        packages,
        p => {
          try {
            /* eslint-disable @typescript-eslint/no-empty-function */
            return Promise.all(
              buildOptions.get(p.pkg).map(item => Promise.resolve(item.builder(p, item.options))),
            ).then(
              () => {},
              err => err,
            );
          } catch (err) {
            return Promise.reject(err);
          }
        },
        app.silent,
      );
    });
    app.hooks.done.tapPromise(`${this.name}-wipe-copied-files`, () => {
      wipeCopiedFiles();
      return Promise.resolve();
    });
  }
}
