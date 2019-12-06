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
    .parse(argv);

  return appRun();
}
