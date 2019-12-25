module.exports = class AfterTestPlugin {
  constructor() {
    this.name = "after-test";
  }

  apply(app) {
    const { STORE } = app.getFeature("config-record");
    STORE.processOrder.push("apply@after-test");

    app.hooks.run.tap(this.name, () => {
      STORE.processOrder.push("hooks.run@after-test");
    });
  }
};
