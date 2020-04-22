import path from "path";
import { Plugin, App, PrepareHelpers } from "vta";
import { deepMerge } from "@vta/helpers";

export declare interface Options {
  modules?: false | "amd" | "umd" | "systemjs" | "commonjs" | "cjs" | "auto";
}

const DEFAULTOPTIONS: Options = {
  modules: false,
};

export default class SyntaxEsnextPlugin extends Plugin {
  constructor(options?: Options) {
    super("@vta/plugin-syntax-esnext");
    this.#options = options;
  }

  #options: Options;

  /* eslint-disable class-methods-use-this */

  prepare(helpers: PrepareHelpers) {
    helpers.registFeature("esnext");
  }

  apply(app: App) {
    const options = deepMerge(
      DEFAULTOPTIONS,
      app.config.config["@vta/syntax-esnext"],
      this.#options,
    );
    app.hooks.config.init((registDir) => {
      registDir(path.resolve(__dirname, "./config"));
    });

    app.hooks.config.itemBaseStart("babel", () => ({
      "@vta/syntax-esnext": { cwd: app.cwd, options },
    }));
    app.hooks.config.itemDone("babel", (config) => {
      Reflect.deleteProperty(config, "@vta/syntax-esnext");
    });
  }
}
