import { Plugin, App } from "vta";
import { spawn } from "@vta/helpers";

export declare interface LernaPublishOptions {
  version?: string;
  changelog?: boolean;
  release?: "github" | "gitlab";
  registry?: string;
}

export default class LernaPublishPlugin extends Plugin {
  constructor(options: LernaPublishOptions) {
    super("@vta/plugin-monorepo/lerna-publish");
    this.options = options;
  }

  private options: LernaPublishOptions;

  apply(app: App) {
    app.hooks.run.tapPromise(this.name, () => {
      const args = ["publish", this.options.version || "patch"];
      if (this.options.release) {
        args.push("--conventional-commits");
        args.push("--create-release");
        args.push(this.options.release);
      } else if (this.options.changelog !== false) {
        args.push("--conventional-commits");
      }
      args.push("--registry");
      args.push(this.options.registry || "https://registry.npmjs.org");
      return spawn("lerna", args, {
        cwd: app.cwd,
        stdio: [process.stdin, process.stdout, "pipe"],
      }).then((err) => {
        if (err) {
          throw err;
        }
      });
    });
  }
}
