module.exports = class ArgumentRecordPlugin {
  constructor() {
    this.name = "argument-record";
    this.args = {};
  }

  prepare(helpers) {
    this.args["no-push"] = helpers.app.getArgument("no-push");
  }

  apply(app) {
    this.args.unknown = app.getArgument("unknown");
    this.args["bl-true"] = app.getArgument("bl-true");
    this.args["bl-false"] = app.getArgument("bl-false");
    this.args.plugins = app.getArgument("plugins");
    this.args.color = app.getArgument("color");
    app.hooks.done.tap(this.name, () => {
      process.env.VTA_ARGUMENT_RECORD_ARGS = JSON.stringify(this.args);
    });
  }
};
