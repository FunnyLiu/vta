import path from "path";
import { Plugin, App } from "./interface";
import resolveConfig from "./utils/resolve-config";

export default class ConfigPlugin extends Plugin {
  constructor({ cwd }: { cwd: string }, registConfigDir: (dir: string) => void) {
    super("@vta/core/config");
    this.cwd = cwd;
    this.registConfigDir = registConfigDir;
  }

  private cwd: string;

  private registConfigDir: (dir: string) => void;

  apply(app: App) {
    const { dirs, plugins } = resolveConfig(this.cwd);
    app.hooks.init(helpers => {
      plugins.forEach(plugin => {
        helpers.registPlugin(plugin);
      });
    });
    app.hooks.config.init(() => {
      this.registConfigDir(path.resolve(this.cwd, dirs.config));
    });
    app.hooks.config.itemBaseStart("app", () => ({ dirs }));
  }
}
