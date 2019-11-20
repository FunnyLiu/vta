import fs from "fs";
import { deepMerge } from "@vta/helpers";

/* eslint-disable global-require,import/no-dynamic-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-underscore-dangle */

/**
 * load module of the given path, if not exists, return the default value passed to.
 * @param file A path to a file or directory
 * @param def default value when file not exists
 */
export default function loadModule<T>(file: string, def?: T): T {
  const exists = fs.existsSync(file);
  if (!exists) return def;
  const mod = require(file);
  return deepMerge({}, mod && mod.__esModule ? mod.default : mod);
}
