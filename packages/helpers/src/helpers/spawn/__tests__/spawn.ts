import path from "path";
import spawn from "../index";

it("success", () => {
  return spawn("node", [path.resolve(__dirname, "./data/success")]).then(err => {
    expect(err).toBe(undefined);
  });
});

it("error", () => {
  return spawn("node", [path.resolve(__dirname, "./data/error")]).then(err => {
    expect(!!err).toBe(true);
    expect(err.message.indexOf("error.js has something wrong") >= 0).toBe(true);
  });
});

it("error-async", () => {
  return spawn("node", [path.resolve(__dirname, "./data/error-async")]).then(err => {
    expect(!!err).toBe(true);
    expect(err.message.indexOf("error-async.js has something wrong") >= 0).toBe(true);
  });
});

it("error-file-404", () => {
  return spawn("node", [path.resolve(__dirname, "./data/error-404")]).then(err => {
    expect(!!err).toBe(true);
    expect(err.message.indexOf("Cannot find module") >= 0).toBe(true);
  });
});

it("error-cmd-404", () => {
  return spawn("node_node", [path.resolve(__dirname, "./data/error")]).then(err => {
    expect(!!err).toBe(true);
  });
});

it("error-exit", () => {
  return spawn("node", [path.resolve(__dirname, "./data/error-exit")]).then(err => {
    expect(!!err).toBe(true);
    expect(err.message.indexOf("child_processor exit with code") >= 0).toBe(true);
  });
});

it("error-exit-stderr", () => {
  return spawn("node", [path.resolve(__dirname, "./data/error-exit-stderr")]).then(err => {
    expect(!!err).toBe(true);
    expect(err.message.indexOf("error-exit-stderr.js has something wrong") >= 0).toBe(true);
  });
});
