import { SpawnOptions } from "child_process";
import crossSpawn from "cross-spawn";
import chalk from "chalk";

function spawn(command: string, options?: SpawnOptions): Promise<Error>;
function spawn(command: string, args?: string[], options?: SpawnOptions): Promise<Error>;
function spawn(
  command: string,
  argsOrOptions?: string[] | SpawnOptions,
  options: SpawnOptions = {},
): Promise<Error> {
  const args = Array.isArray(argsOrOptions) ? argsOrOptions : [];
  return new Promise(resolve => {
    const p = crossSpawn(command, args, Array.isArray(argsOrOptions) ? options : argsOrOptions);

    let errorProcessed = false;

    const errorProcessor = (err: Error) => {
      if (errorProcessed) return;
      errorProcessed = true;
      resolve(err);
    };

    p.on("exit", (code, signal) => {
      if (code === 0) {
        resolve();
      } else if (signal) {
        errorProcessor(new Error(`child_processor exit by signal ${chalk.yellow(signal)} `));
      } else {
        let errMsg = p.stderr?.read()?.toString("utf-8");
        if (!errMsg) {
          errMsg = p.stdout?.read()?.toString("utf-8");
        }
        errorProcessor(
          new Error(errMsg || `child_processor exit with code ${chalk.yellow(code.toString())}`),
        );
      }
    });
    p.on("error", err => {
      errorProcessor(err);
    });
  });
}

export default spawn;
