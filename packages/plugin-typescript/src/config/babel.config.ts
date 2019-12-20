import { mutate } from "@vta/config";

export default mutate({ path: "presets", value: ["@babel/preset-typescript"], mode: "push" });
