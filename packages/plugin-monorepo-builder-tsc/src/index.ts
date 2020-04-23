import { Plugin, App } from "vta";
import { FeatureOptions, BuilderOptions } from "@vta/plugin-monorepo";
import tsc from "@vta/tsc";

export declare interface Options {
  project?: string;
  babel?: string;
  sourceDir?: string;
  outDir?: string;
  exclude?: string[];
}

export default class MonorepoBuilderTscPlugin extends Plugin {
  constructor(options?: BuilderOptions<Options>) {
    super("@vta/plugin-monorepo-builder-tsc");
    this.#options = options;
  }

  #options: BuilderOptions<Options>;

  apply(app: App) {
    const features = {
      monorepo: app.getFeature<FeatureOptions>("monorepo"),
      react: !!app.getFeature("react"),
      vue: !!app.getFeature("vue"),
    };
    if (!features.monorepo) return;
    features.monorepo.registBuilder<Options>((pkg, options = {}) => {
      return tsc({
        cwd: pkg.cwd,
        sourceDir: options.sourceDir,
        outDir: options.outDir,
        project: options.project,
        babel: options.babel,
        exclude: options.exclude,
        extTs: ["ts"].concat(features.react || features.vue ? ["tsx"] : []).join(","),
        extJs: ["js"].concat(features.react || features.vue ? ["jsx"] : []).join(","),
        silent: app.silent,
      });
    }, this.#options);
  }
}
