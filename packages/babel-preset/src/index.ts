import { resolveConfig } from "vta";

export default function vtaBabelPreset() {
  const { presets = [], plugins = [] } = resolveConfig("babel") || {};
  return { presets, plugins };
}
