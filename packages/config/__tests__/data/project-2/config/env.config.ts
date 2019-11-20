import { useDeps } from "@vta/config";

export default useDeps("app", app => ({
  name: `name-${app.appid}`,
  remoteDev: false,
  hot: true,
}));
