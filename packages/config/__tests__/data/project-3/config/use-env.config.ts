import { useValue, mutate, useBase } from "@vta/config";

export default useValue("info.date", (date) =>
  useValue(
    [
      { path: "version", key: "app" },
      { path: "plugins[0][0]", key: "babel" },
    ],
    ([version, pluginName]) => ({
      baseDate: date,
      version,
      pluginName,
      env: useBase((base) => ({
        development: mutate({ path: "plugins", value: "typescript", mode: "push" }, () => ({
          envBaseDate: `${base.baseDate}-dev`,
        })),
        production: mutate({ path: "plugins", value: "react", mode: "push" }, () => ({
          envBaseDate: `${base.baseDate}-prod`,
        })),
        test: mutate({ path: "plugins", value: "vue", mode: "push" }, () => ({
          envBaseDate: `${base.baseDate}-test`,
        })),
      })),
    }),
  ),
);
