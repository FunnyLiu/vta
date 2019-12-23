const Plugin01 = require("../../plugins/01"); // eslint-disable-line

module.exports = function preset01(options) {
  return {
    plugins: [new Plugin01({ guid: options.guid })],
  };
};
