import path from "path";
import { Plugin, PrepareHelpers, App } from "vta";
import TscPlugin from "./plugins/TscPlugin";

export declare interface Options {
  project?: string;
  exclude?: string[];
}

export default class TypescriptPlugin extends Plugin {
  constructor(options: Options = {}) {
    super("@vta/plugin-typescript");
    this.#options = options;
  }

  #options: Options;

  /* eslint-disable class-methods-use-this */
  prepare(helpers: PrepareHelpers) {
    helpers.registFeature("typescript");
    helpers.registPlugin(
      new TscPlugin({
        project: this.#options.project,
        exclude: this.#options.exclude,
      }),
    );
  }

  apply(app: App) {
    app.hooks.config.init((registDir) => {
      registDir(path.resolve(__dirname, "./config"));
    });
  }
}
