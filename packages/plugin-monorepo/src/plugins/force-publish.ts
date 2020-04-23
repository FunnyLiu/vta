import { Plugin, App } from "vta";
import { spawn } from "@vta/helpers";

export declare interface ForcePublishOptions {
  pkgs: string[];
  registry?: string;
}

function publishOneByOne(
  [item, ...items]: string[],
  publishor: (pkg: string) => Promise<Error>,
): Promise<void> {
  if (!item) return Promise.resolve();
  return publishor(item).then((err) => {
    if (err) {
      throw err;
    }
    return publishOneByOne(items, publishor);
  });
}

export default class ForcePublishPlugin extends Plugin {
  constructor(options: ForcePublishOptions) {
    super("@vta/plugin-monorepo/force-publish");
    this.#options = options;
  }

  #options: ForcePublishOptions;

  apply(app: App) {
    app.hooks.run.tapPromise(this.name, () => {
      const args = ["publish", "--access", "public"];
      args.push("--registry");
      args.push(this.#options.registry || "https://registry.npmjs.org");
      return publishOneByOne(this.#options.pkgs, (pkg) =>
        spawn("npm", args, {
          cwd: pkg,
          stdio: [process.stdin, process.stdout, "pipe"],
        }),
      );
    });
  }
}
