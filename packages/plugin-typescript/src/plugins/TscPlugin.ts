import { Plugin, App } from "vta";
import tsc from "@vta/tsc";

export interface Options {
  project?: string;
  exclude?: string[];
}

export default class TscPlugin extends Plugin {
  constructor(options: Options = {}) {
    super("@vta/plugin-typescript/tsc");
    this.options = options;
  }

  private options: Options;

  apply(app: App) {
    const features = {
      webpack: app.getFeature("webpack"),
      react: app.getFeature("react"),
    };
    // only use @vta/tsc when not regist webpack plugin
    if (!features.webpack) {
      app.hooks.run.tapPromise(this.name, () => {
        return tsc({
          cwd: app.cwd,
          sourceDir: app.config.dirs.src,
          outDir: app.config.dirs.build,
          project: this.options.project,
          exclude: this.options.exclude,
          extTs: ["ts"].concat(features.react ? ["tsx"] : []).join(","),
          extJs: ["js"].concat(features.react ? ["jsx"] : []).join(","),
          silent: true,
        }).then(err => {
          if (err) {
            throw err;
          }
        });
      });
    }
  }
}
