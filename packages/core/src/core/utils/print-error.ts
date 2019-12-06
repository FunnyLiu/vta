import chalk from "chalk";

export default function printError(err: { message: string }) {
  const version = process.env.VTA_VERSION || "0.0.0";
  console.log(`${chalk.cyan(`[vta@${version}]:`)} ${chalk.red(err.message)}`);
}
