const symType = Symbol("non-helper-type");

module.exports = {
  appid: "project-1",
  version: "20191118-1",
  nonHelper: {
    type: symType,
    payload: "non-helper",
  },
};
