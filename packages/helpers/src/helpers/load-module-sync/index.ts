import fileExistsSync from "../file-exists-sync";

/* eslint-disable global-require,import/no-dynamic-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-underscore-dangle */

/**
 * load module of the given path, if not exists, return the default value passed to.
 * @param file A path to a file or directory
 * @param def default value when file not exists
 */
export default function loadModuleSync<T>(file: string, def?: T): T {
  const exists = fileExistsSync(file);
  if (!exists) return def;
  const mod = require(file);
  return mod && mod.__esModule ? mod.default : mod;
}
