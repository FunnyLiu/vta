import path from "path";
import chalk from "chalk";
import { loadModuleSync } from "@vta/helpers";
import { Plugin, VtaConfig } from "../interface";
import standardizeName from "./standardize-name";

const configFiles = [".vta.config.js", ".vta.js", ".vta.json"];

export default function resolveConfig(
  cwd: string,
): Omit<VtaConfig, "plugins"> & { plugins: Plugin[] } {
  const plugins: Plugin[] = [];
  let config: VtaConfig;
  for (let i = 0, len = configFiles.length; i < len; i += 1) {
    config = loadModuleSync<VtaConfig>(path.resolve(cwd, configFiles[i]));
    if (config) {
      break;
    }
  }
  if (!config) {
    const packageJson = loadModuleSync<{ vta?: VtaConfig }>(path.resolve(cwd, "package.json"), {});
    config = packageJson.vta;
  }
  if (!config) {
    throw new Error("cannot load vta config file");
  }
  if (config.plugins) {
    config.plugins.forEach(plugin => {
      if (Array.isArray(plugin)) {
        const [name, options] = plugin;
        let LoadedPlugin;
        try {
          LoadedPlugin = loadModuleSync<Plugin>(
            require.resolve(standardizeName("plugin", name), { paths: [cwd] }),
          );
        } catch {} // eslint-disable-line
        if (!LoadedPlugin) {
          throw new Error(`cannot load plugin ${chalk.yellow(name)}`);
        }
        plugins.push(new LoadedPlugin(options));
      } else {
        plugins.push(plugin);
      }
    });
  }
  return {
    dirs: {
      config: config.dirs?.config || "config",
      src: config.dirs?.src || "src",
      build: config.dirs?.build || "build",
    },
    plugins,
  };
}
