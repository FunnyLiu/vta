import path from "path";
import { Command } from "commander";
import appRun from "../core";

process.env.NODE_ENV = "development";

export default function run(argv): Promise<Error> {
  const program = new Command();
  program.allowUnknownOption(true);
  program
    .name("vta start")
    .usage("--env vta_env")
    .option("--env <env>", "vta environment, default development")
    .option("--silent <silent>", "silent mode dont display anything, default false")
    .option("--cwd <cwd>", "woking directory relative to current working directory, default .")
    .parse(argv);

  return appRun({
    cwd: path.resolve(process.cwd(), program.cwd || "."),
    silent: program.silent,
    arguments: argv,
  }).then(({ error }) => error);
}
