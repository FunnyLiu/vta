import { mutate } from "@vta/config";

export default mutate(
  { path: "presets[1]", value: ["typescript", { ver: "3.7.2" }], mode: "insert-before" },
  base => ({
    presetsLength: base.presets.length,
  }),
);
