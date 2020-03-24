import { useBase } from "@vta/config";

export default useBase((base) => ({
  appid: "project-2",
  version: `${base.version}-2`,
}));
