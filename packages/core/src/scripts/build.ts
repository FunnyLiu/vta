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
    .parse(argv);

  return appRun({ silent: program.silent, arguments: argv }).then(({ error }) => error);
}
