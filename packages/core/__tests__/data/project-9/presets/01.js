const Plugin02 = require("../plugins/02"); // eslint-disable-line

module.exports = function preset01(options) {
  return {
    presets: [["./inner-presets", { guid: options.guid1 }]],
    plugins: [new Plugin02({ guid: options.guid2 })],
  };
};
