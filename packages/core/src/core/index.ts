import App from "./App";
import printError from "./utils/print-error";

declare interface Options {
  cwd?: string;
  silent?: boolean;
}

export default function appRun({ cwd = process.cwd(), silent = false }: Options = {}): Promise<
  Error
> {
  return new App({ cwd })
    .run()
    .then(() => {
      return undefined;
    })
    .catch(err => {
      if (!silent) {
        printError(err);
      }
      return err;
    });
}
