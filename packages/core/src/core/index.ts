import App from "./App";
import printError from "./utils/print-error";

declare interface Options {
  cwd?: string;
  silent?: boolean;
}

export function appRunSync(
  { cwd = process.cwd(), silent = false }: Options = {},
  cb: (err: Error) => void,
): void {
  new App({ cwd }).run(err => {
    try {
      if (err && !silent) {
        printError(err);
      }
      cb(err);
    } catch {} // eslint-disable-line
  });
}

export default function appRun(options?: Options): Promise<{ error: Error }> {
  return new Promise(resolve => {
    appRunSync(options, err => {
      resolve({ error: err });
    });
  });
}
