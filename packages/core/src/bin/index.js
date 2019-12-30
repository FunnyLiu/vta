#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { Command } from "commander";
import chalk from "chalk";
import printError from "../core/utils/print-error";

import packageJson from "../../package.json";

const program = new Command();
program.allowUnknownOption(true);
program
  .version(packageJson.version, "-v,--version")
  .option("--env <env>", "vta environment, default NODE_ENV")
  .parse(process.argv);

process.env.VTA_VERSION = packageJson.version;

const script = program.args[0];
const scriptPath = path.resolve(__dirname, `../scripts/${script}.js`);
fs.exists(scriptPath, exists => {
  if (exists) {
    /* eslint-disable global-require,import/no-dynamic-require */
    const run = require(scriptPath).default;
    process.env.VTA_ENV = program.env || process.env.NODE_ENV;
    run(process.argv.slice(1), packageJson.version).then(err => {
      if (err) {
        process.exit(1);
      }
    });
  } else {
    printError(new Error(`unsupport script ${chalk.yellow(script)}, you may need to upgrade vta`));
    process.exit(0);
  }
});
