import { useValue } from "@vta/config";

export default useValue("info.date", date =>
  useValue(
    [
      { path: "version", key: "app" },
      { path: "plugins[0][0]", key: "babel" },
    ],
    ([version, pluginName]) => ({
      baseDate: date,
      version,
      pluginName,
    }),
  ),
);
