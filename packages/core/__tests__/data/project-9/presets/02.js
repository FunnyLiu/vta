const Plugin02 = require("../plugins/02"); // eslint-disable-line
const Plugin03 = require("../plugins/03"); // eslint-disable-line

module.exports = function preset01(options) {
  return {
    plugins: [new Plugin02({ guid: options.guid2 }), ["../plugins/03", { guid: options.guid3 }]],
  };
};
