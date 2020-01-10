import path from "path";
import { Command } from "commander";
import appRun from "../core";

process.env.NODE_ENV = "production";

export default function run(argv): Promise<Error> {
  const program = new Command();
  program.allowUnknownOption(true);
  program
    .name("vta build")
    .usage("--env vta_env")
    .option("--env <env>", "vta environment, default production")
    .option("--silent <silent>", "silent mode dont display anything, default false")
    .option("--cwd <cwd>", "woking directory relative to current working directory, default .")
    .option("--config <config>", "root config file relative to working directory")
    .parse(argv);

  return appRun({
    cwd: path.resolve(process.cwd(), program.cwd || "."),
    config: program.config,
    silent: program.silent,
    arguments: argv,
  }).then(({ error }) => error);
}
