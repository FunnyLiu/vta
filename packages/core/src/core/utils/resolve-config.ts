import path from "path";
import chalk from "chalk";
import { loadModuleSync, deepMerge } from "@vta/helpers";
import { Plugin, VtaConfig, AppConfigInternal, Preset } from "../interface";
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
    plugins.forEach((plugin) => {
      if (Array.isArray(plugin)) {
        const [name, options] = plugin;
        let LoadedPlugin;
        try {
          const file = require.resolve(standardizeName("plugin", name), { paths: [cwd] });
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
// 获取预设中的插件
function resolvePresets(presets: Array<[string, object?]>, cwd: string): Plugin[] {
  const resolvedPlugins: Plugin[] = [];
  if (presets) {
    presets.forEach((preset) => {
      const [name, options] = preset;
      let LoadedPreset: Preset;
      let nextCwd = "";
      try {
        // 找到文件
        const file = require.resolve(standardizeName("preset", name), { paths: [cwd] });
        // 一层层递归往上找
        nextCwd = path.resolve(file, "../");
        LoadedPreset = loadModuleSync<Preset>(file);
      } catch {} // eslint-disable-line
      if (!LoadedPreset) {
        throw new Error(`cannot load preset ${chalk.yellow(name)}`);
      } else {
        const { presets: nextPresets, plugins } = LoadedPreset(options);
        resolvePresets(nextPresets, nextCwd).forEach((plugin) => {
          resolvedPlugins.push(plugin);
        });
        resolvePlugins(plugins, nextCwd).forEach((plugin) => {
          resolvedPlugins.push(plugin);
        });
      }
    });
  }
  return resolvedPlugins;
}
// 获取配置
export default function resolveConfig(
  cwd: string,
  configFile?: string,
): Required<AppConfigInternal> & { plugins: Plugin[]; configFile: string } {
  const plugins: Plugin[] = [];
  let config: VtaConfig;
  let targetConfigFile;
  if (configFile) {
    const file = path.resolve(cwd, configFile);
    config = loadModuleSync<VtaConfig>(file);
    targetConfigFile = file;
    if (config) {
      cwd = path.resolve(targetConfigFile, "../"); // eslint-disable-line
    }
  } else {
    for (let i = 0, len = configFiles.length; i < len; i += 1) {
      const file = path.resolve(cwd, configFiles[i]);
      config = loadModuleSync<VtaConfig>(file);
      if (config) {
        targetConfigFile = file;
        break;
      }
    }
  }
  //如果没有配置文件
  if (!config) {
    const file = path.resolve(cwd, "package.json");
    const packageJson = loadModuleSync<{ vta?: VtaConfig }>(file, {});
    //从package.json中拿
    config = packageJson.vta;
    targetConfigFile = file;
  }
  if (!config) {
    throw new Error("cannot load vta config file");
  }
  config = getConfigThroughEnv(config);
  // 获取预设
  resolvePresets(config.presets, cwd).forEach((plugin) => {
    plugins.push(plugin);
  });
  resolvePlugins(config.plugins, cwd).forEach((plugin) => {
    plugins.push(plugin);
  });

  return {
    dirs: {
      config: config.dirs?.config || "config",
      src: config.dirs?.src || "src",
      build: config.dirs?.build || "dist",
    },
    config: config.config || {},
    plugins,
    configFile: targetConfigFile,
  };
}
