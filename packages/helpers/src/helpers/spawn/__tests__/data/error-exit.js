function errorFunc() {
  throw new Error("error-exit.js has something wrong");
}

try {
  errorFunc();
} catch {
  process.exit(2);
}
