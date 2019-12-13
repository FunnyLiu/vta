import path from "path";
import chalk from "chalk";
import { loadModuleSync, clearRequireCache, deepMerge } from "@vta/helpers";
import { Plugin, VtaConfig } from "../interface";
import standardizeName from "./standardize-name";

const configFiles = [".vta.config.js", ".vta.js", ".vta.json"];

function getConfigThroughEnv(config: VtaConfig): VtaConfig {
  const { env = {}, ...others } = config;
  return deepMerge<VtaConfig, VtaConfig>(others, env[process.env.VTA_ENV || process.env.NODE_ENV]);
}

export default function resolveConfig(
  cwd: string,
): Omit<VtaConfig, "plugins"> & { plugins: Plugin[] } {
  const plugins: Plugin[] = [];
  let config: VtaConfig;
  for (let i = 0, len = configFiles.length; i < len; i += 1) {
    const file = path.resolve(cwd, configFiles[i]);
    clearRequireCache(file);
    config = loadModuleSync<VtaConfig>(file);
    if (config) {
      break;
    }
  }
  if (!config) {
    const file = path.resolve(cwd, "package.json");
    clearRequireCache(file);
    const packageJson = loadModuleSync<{ vta?: VtaConfig }>(file, {});
    config = packageJson.vta;
  }
  if (!config) {
    throw new Error("cannot load vta config file");
  }
  config = getConfigThroughEnv(config);
  if (config.plugins) {
    config.plugins.forEach(plugin => {
      if (Array.isArray(plugin)) {
        const [name, options] = plugin;
        let LoadedPlugin;
        try {
          const file = require.resolve(standardizeName("plugin", name), { paths: [cwd] });
          clearRequireCache(file);
          LoadedPlugin = loadModuleSync<Plugin>(file);
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
