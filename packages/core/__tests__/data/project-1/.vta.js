const AdditionalPlugin = require("./plugins/additional-plugin");

module.exports = {
  dirs: {
    config: "config-1",
  },
  plugins: [
    ["./plugins/config-record-plugin.js", { guid: "905365f0-e49b-49bc-afe7-7550e46297bb" }],
    new AdditionalPlugin({ guid: "ffcaadf3-d3ef-492a-b310-d9bd9ed57c8a" }),
    ["./plugins/argument-record-plugin.js"],
  ],
};
