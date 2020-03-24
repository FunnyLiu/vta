const path = require("path");
const fse = require("fs-extra");
const chalk = require("chalk");

function fileExists(dest) {
  return new Promise((resolve) => {
    fse.exists(dest, resolve);
  });
}

function copyFiles(files, copiedFiles, cwd) {
  if (files.length === 0) return Promise.resolve();
  const { src, dest } = files[0];
  return fileExists(dest)
    .then((destExists) => {
      if (!destExists) {
        return fileExists(src).then((srcExists) => {
          if (srcExists) {
            return fse
              .ensureDir(dest.replace(/[^/\\]+?$/, ""))
              .then(() => fse.copyFile(src, dest))
              .then(() => ({ src, dest, copied: true }))
              .catch(() => {
                throw new Error(
                  `[file copy fail] from ${chalk.cyan(path.relative(cwd, src))} to ${chalk.yellow(
                    path.relative(cwd, dest),
                  )}`,
                );
              });
          }
          throw new Error(`[file cannot find] ${chalk.yellow(path.relative(cwd, src))}`);
        });
      }
      return { src, dest, copied: false };
    })
    .then((file) => {
      copiedFiles.push(file);
      return copyFiles(files.slice(1), copiedFiles, cwd);
    });
}

module.exports = class CopiedFilesStore {
  constructor(cwd, savePath) {
    this.cwd = cwd;
    this.needCopiedFiles = [];
    this.savePath =
      savePath ||
      path.resolve(
        process.cwd(),
        `./node_modules/.cache/@vta/plugin-monorepo/copied-files-${Date.now()}-${Math.floor(
          Math.random() * 10000,
        )}.json`,
      );

    this.wipe = this.wipe.bind(this);
  }

  add(src, dest) {
    this.needCopiedFiles.push({ src, dest });
  }

  commit() {
    const copiedFiles = [];
    return copyFiles(this.needCopiedFiles, copiedFiles, this.cwd).then(
      () => {
        return fse.ensureFile(this.savePath).then(() =>
          fse.writeFile(
            this.savePath,
            JSON.stringify(
              copiedFiles.filter(({ copied }) => copied).map(({ dest }) => dest),
              null,
              2,
            ),
            {
              encoding: "utf8",
            },
          ),
        );
      },
      (err) => {
        return Promise.all(
          copiedFiles.filter(({ copied }) => copied).map(({ dest }) => fse.remove(dest)),
        ).then(() => {
          throw err;
        });
      },
    );
  }

  wipe() {
    return fileExists(this.savePath).then((exists) => {
      if (exists) {
        return fse
          .readFile(this.savePath, { encoding: "utf8" })
          .then((content) => JSON.parse(content))
          .then((files) => Promise.all(files.map((dest) => fse.remove(dest))))
          .then(() => fse.remove(this.savePath));
      }
      return Promise.resolve();
    });
  }
};
