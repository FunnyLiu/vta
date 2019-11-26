import { mutate } from "@vta/config";

export default mutate([
  { path: "plugins", value: ["transform-runtime", { corejs: 3 }], mode: "unshift" },
]);
