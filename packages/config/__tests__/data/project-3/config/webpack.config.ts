import { useDeps } from "@vta/config";

export default useDeps(["app", "env", "webpack-server"], ([app, env, server]) => ({
  version: `version-${app.version}`,
  remoteDev: env.remoteDev,
  server: {
    hot: server.hot,
  },
}));
