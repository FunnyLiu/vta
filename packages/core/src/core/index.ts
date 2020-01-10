import { Config } from "@vta/config";
import App from "./App";
import printError from "./utils/print-error";

declare interface Options {
  cwd?: string;
  config?: string;
  silent?: boolean;
  dontRun?: boolean;
  arguments?: string[];
}

export function appRunSync(
  {
    cwd = process.cwd(),
    config,
    silent = false,
    dontRun = false,
    arguments: args = [],
  }: Options = {},
  cb: (err: Error, resolveConfig?: <T = Config>(key: string) => T) => void,
): void {
  new App({ cwd, configFile: config, silent, dontRun, arguments: args }).run(
    (err, resolveConfig) => {
      try {
        if (err && !silent) {
          printError(err);
        }
        cb(err, resolveConfig);
      } catch {} // eslint-disable-line
    },
  );
}

export default function appRun(
  options?: Options,
): Promise<{ error: Error; resolveConfig?: <T = Config>(key: string) => T }> {
  return new Promise(resolve => {
    appRunSync(options, (err, resolveConfig) => {
      resolve({ error: err, resolveConfig });
    });
  });
}
