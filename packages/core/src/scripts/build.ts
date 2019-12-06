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
    .parse(argv);

  return appRun();
}
