import { useBase } from "@vta/config";

export default useBase((base) => ({
  enableHooks: base.enableHooks.concat("project-1"),
}));
