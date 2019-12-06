import path from "path";

const EXACT_RE = /^module:/;
const VTA_PLUGIN_PREFIX_RE = /^(?!@|module:|[^/]+\/|vta-plugin-)/;
const VTA_PRESET_PREFIX_RE = /^(?!@|module:|[^/]+\/|vta-preset-)/;
const VTA_PLUGIN_ORG_RE = /^(@vta\/)(?!plugin-|[^/]+\/)/;
const VTA_PRESET_ORG_RE = /^(@vta\/)(?!preset-|[^/]+\/)/;
const OTHER_PLUGIN_ORG_RE = /^(@(?!vta\/)[^/]+\/)(?![^/]*vta-plugin(?:-|\/|$)|[^/]+\/)/;
const OTHER_PRESET_ORG_RE = /^(@(?!vta\/)[^/]+\/)(?![^/]*vta-preset(?:-|\/|$)|[^/]+\/)/;
const OTHER_ORG_DEFAULT_RE = /^(@(?!vta$)[^/]+)$/;

export default function standardizeName(type: "plugin" | "preset", name): string {
  if (path.isAbsolute(name) || name[0] === ".") return name;
  const isPreset = type === "preset";
  return name
    .replace(isPreset ? VTA_PRESET_PREFIX_RE : VTA_PLUGIN_PREFIX_RE, `vta-${type}-`)
    .replace(isPreset ? VTA_PRESET_ORG_RE : VTA_PLUGIN_ORG_RE, `$1${type}-`)
    .replace(isPreset ? OTHER_PRESET_ORG_RE : OTHER_PLUGIN_ORG_RE, `$1vta-${type}-`)
    .replace(OTHER_ORG_DEFAULT_RE, `$1/vta-${type}`)
    .replace(EXACT_RE, "");
}
