import path from "path";
import chalk from "chalk";
import { loadModuleSync, clearRequireCache, deepMerge } from "@vta/helpers";
import { Plugin, VtaConfig, AppConfig, Preset } from "../interface";
import standardizeName from "./standardize-name";

const configFiles = [".vta.config.js", ".vta.js", ".vta.config.json", ".vta.json"];

function getConfigThroughEnv(config: VtaConfig): VtaConfig {
  const { env = {}, ...others } = config;
  return deepMerge<VtaConfig, VtaConfig>(
    others,
    env[process.env.VTA_ENV || process.env.NODE_ENV || "development"],
  );
}

function resolvePlugins(plugins: Array<Plugin | [string, object?]>, cwd: string): Plugin[] {
  const resolvedPlugins: Plugin[] = [];
  if (plugins) {
    plugins.forEach(plugin => {
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
        resolvedPlugins.push(new LoadedPlugin(options));
      } else {
        resolvedPlugins.push(plugin);
      }
    });
  }
  return resolvedPlugins;
}

function resolvePresets(presets: Array<[string, object?]>, cwd: string): Plugin[] {
  const resolvedPlugins: Plugin[] = [];
  if (presets) {
    presets.forEach(preset => {
      const [name, options] = preset;
      let LoadedPreset: Preset;
      let nextCwd = "";
      try {
        const file = require.resolve(standardizeName("preset", name), { paths: [cwd] });
        clearRequireCache(file);
        nextCwd = path.resolve(file, "../");
        LoadedPreset = loadModuleSync<Preset>(file);
      } catch {} // eslint-disable-line
      if (!LoadedPreset) {
        throw new Error(`cannot load preset ${chalk.yellow(name)}`);
      } else {
        const { presets: nextPresets, plugins } = LoadedPreset(options);
        resolvePresets(nextPresets, nextCwd).forEach(plugin => {
          resolvedPlugins.push(plugin);
        });
        resolvePlugins(plugins, nextCwd).forEach(plugin => {
          resolvedPlugins.push(plugin);
        });
      }
    });
  }
  return resolvedPlugins;
}

export default function resolveConfig(cwd: string): AppConfig & { plugins: Plugin[] } {
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

  resolvePresets(config.presets, cwd).forEach(plugin => {
    plugins.push(plugin);
  });
  resolvePlugins(config.plugins, cwd).forEach(plugin => {
    plugins.push(plugin);
  });

  return {
    dirs: {
      config: config.dirs?.config || "config",
      src: config.dirs?.src || "src",
      build: config.dirs?.build || "dist",
    },
    plugins,
  };
}
