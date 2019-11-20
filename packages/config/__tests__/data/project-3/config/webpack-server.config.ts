import { useDeps } from "@vta/config";

export default useDeps("env", env => ({
  hot: env.hot,
}));
