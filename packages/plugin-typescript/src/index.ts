import { Plugin, PrepareHelpers } from "vta";
import TscPlugin from "./plugins/TscPlugin";

export declare interface Options {
  project?: string;
  exclude?: string[];
  silent?: boolean;
}

export default class TypescriptPlugin extends Plugin {
  constructor(options: Options = {}) {
    super("@vta/plugin-typescript");
    this.options = options;
  }

  private options: Options;

  /* eslint-disable class-methods-use-this */
  prepare(helpers: PrepareHelpers) {
    helpers.registFeature("typescript");
    helpers.registPlugin(
      new TscPlugin({
        project: this.options.project,
        exclude: this.options.exclude,
        silent: this.options.silent,
      }),
    );
  }
}
