import { useBase } from "@vta/config";

export default useBase(base => ({
  env: {
    development: { mode: `${base.appid}-development`, devMode: { active: true } },
    production: { mode: `${base.appid}-production` },
  },
}));
