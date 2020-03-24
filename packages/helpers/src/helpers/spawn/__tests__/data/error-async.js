process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(2);
});

function errorFunc() {
  return Promise.reject(new Error("error-async.js has something wrong"));
}

errorFunc();
