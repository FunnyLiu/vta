import path from "path";
import { Plugin, App, PrepareHelpers, VtaConfig } from "./interface";
import resolveConfig from "./utils/resolve-config";

export default class ConfigPlugin extends Plugin {
  constructor({ cwd }: { cwd: string }, registConfigDir: (dir: string) => void) {
    super("@vta/core/config");
    this.cwd = cwd;
    this.registConfigDir = registConfigDir;
    this.config = resolveConfig(cwd);
  }

  private cwd: string;

  private config: Omit<VtaConfig, "plugins"> & { plugins: Plugin[] };

  private registConfigDir: (dir: string) => void;

  prepare(helpers: PrepareHelpers) {
    this.config.plugins.forEach(plugin => {
      helpers.registPlugin(plugin);
    });
    this.registConfigDir(path.resolve(this.cwd, this.config.dirs.config));
  }

  apply(app: App) {
    const { dirs } = this.config;
    app.hooks.config.itemBaseStart("app", () => ({ dirs }));
  }
}
