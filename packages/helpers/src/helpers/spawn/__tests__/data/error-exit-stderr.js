function errorFunc() {
  throw new Error("error-exit-stderr.js has something wrong");
}

try {
  errorFunc();
} catch (err) {
  console.error(err);
  process.exit(2);
}
