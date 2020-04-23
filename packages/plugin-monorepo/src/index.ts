import path from "path";
import { Plugin, App, PrepareHelpers } from "vta";
import { Options, FeatureOptions, Builder, BuilderOptions, Pkg } from "./interface";
import resolvePackages from "./lib/resolve-packages";
import copyFiles from "./lib/copy-files";
import build from "./lib/build";
import testPkgMatched from "./utils/test-pkg-matched";
import LernaPublishPlugin from "./plugins/lerna-publish";
import ForcePublishPlugin from "./plugins/force-publish";

/* eslint-disable @typescript-eslint/no-explicit-any */

export { FeatureOptions, BuilderOptions };

export default class MonorepoPlugin extends Plugin {
  constructor(options: Options = {}) {
    super("@vta/plugin-monorepo");
    this.#options = options;
  }

  #options: Options;

  #builders: Map<Builder, BuilderOptions> = new Map<Builder, BuilderOptions>();

  #registBuilder = <T = { [key: string]: any }>(
    builder: Builder<T>,
    options?: BuilderOptions<T>,
  ): void => {
    this.#builders.set(builder, options);
  };

  prepare(helpers: PrepareHelpers) {
    helpers.registFeature<FeatureOptions>("monorepo", {
      registBuilder: this.#registBuilder,
    });
    const forcePublish = helpers.app.getArgument("mono-force-publish");
    if (forcePublish) {
      let forcePublishPkgs;
      if (typeof forcePublish === "string") {
        forcePublishPkgs = forcePublish.split(",");
      } else {
        forcePublishPkgs = resolvePackages(
          path.resolve(helpers.app.cwd, this.#options.packages || "packages"),
        ).map(({ pkg }) => pkg);
      }
      helpers.registPlugin(
        new ForcePublishPlugin({
          pkgs: forcePublishPkgs.map((pkg) =>
            path.resolve(helpers.app.cwd, this.#options.packages || "packages", pkg),
          ),
          registry: this.#options.registry,
        }),
      );
    } else if (this.#options.publish !== false) {
      helpers.registPlugin(
        new LernaPublishPlugin({
          version: (helpers.app.getArgument("mono-version") as string) || this.#options.version,
          changelog: this.#options.changelog,
          release: this.#options.release,
          registry: this.#options.registry,
        }),
        true,
      );
    }
  }

  apply(app: App) {
    let packages: Pkg[];
    app.hooks.run.tapPromise(`${this.name}-resolve-packages`, () => {
      packages = resolvePackages(path.resolve(app.cwd, this.#options.packages || "packages"));
      return Promise.resolve();
    });
    let wipeCopiedFiles;
    app.hooks.run.tapPromise(`${this.name}-copy-files`, () => {
      const { filesToCopy = [] } = this.#options;
      return copyFiles(packages, filesToCopy, app.cwd).then((store) => {
        wipeCopiedFiles = store.wipe;
      });
    });
    app.hooks.run.tapPromise(`${this.name}-build`, () => {
      const buildOptions = new Map<
        string,
        Array<{ builder: Builder; options: { [key: string]: any } }>
      >();
      packages.forEach((p) => {
        buildOptions.set(p.pkg, []);
        this.#builders.forEach((options, builder) => {
          if (testPkgMatched(options?.include, options?.exclude, p.pkg)) {
            buildOptions.get(p.pkg).push({ builder, options: options?.options });
          }
        });
      });
      return build(
        packages,
        (p) => {
          try {
            /* eslint-disable @typescript-eslint/no-empty-function */
            return Promise.all(
              buildOptions.get(p.pkg).map((item) => Promise.resolve(item.builder(p, item.options))),
            ).then(
              () => {},
              (err) => err,
            );
          } catch (err) {
            return Promise.resolve(err);
          }
        },
        app.silent,
      );
    });
    app.hooks.restart.tapPromise(`${this.name}-wipe-copied-files`, () => {
      return wipeCopiedFiles();
    });
    app.hooks.exit.tapPromise(`${this.name}-wipe-copied-files`, () => {
      return wipeCopiedFiles();
    });
  }
}
