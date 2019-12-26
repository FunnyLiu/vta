const path = require("path"); // eslint-disable-line
const fs = require("fs"); // eslint-disable-line

let idx = 0;

module.exports = class RecordPlugin {
  constructor(options) {
    this.name = `monorepo-record-plugin-${(idx += 1)}`;
    this.options = options;
    this.idx = idx;
  }

  apply(app) {
    const store = {
      runExists: { module1: false, module2: false },
      doneExists: { module1: true, module2: true },
      options: { module1: null, module2: null },
    };
    app.getFeature("monorepo").registBuilder(({ pkg }, options) => {
      store.options[pkg] = options;
    }, this.options);
    app.hooks.run.tapPromise(this.name, () => {
      store.runExists.module1 = fs.existsSync(path.resolve(app.cwd, "modules/module1/guid.txt"));
      store.runExists.module2 = fs.existsSync(path.resolve(app.cwd, "modules/module2/guid.txt"));
      return Promise.resolve();
    });
    app.hooks.exit.tapPromise(this.name, () => {
      return new Promise(resolve => {
        setTimeout(resolve, 1500);
      }).then(() => {
        store.doneExists.module1 = fs.existsSync(path.resolve(app.cwd, "modules/module1/guid.txt"));
        store.doneExists.module2 = fs.existsSync(path.resolve(app.cwd, "modules/module2/guid.txt"));
        process.env[`VTA_PLUGIN_MONOREPO_RECORD_STORE_${this.idx}`] = JSON.stringify(store);
      });
    });
  }
};
