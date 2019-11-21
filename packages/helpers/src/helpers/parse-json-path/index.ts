export declare interface JSONPath {
  type: "key" | "index";
  value: string | number;
  children?: JSONPath;
}

/**
 * parse a string path like names[3][8].entry to a JSON object
 * @param path path need to parse
 */
export default function parseJsonPath(path: string): JSONPath {
  const matches = /^(\.|\[)?([^.[\]]+)[.\]]?(.*)$/.exec(path);
  if (matches) {
    const type = matches[1] === "[" ? "index" : "key";
    return {
      type,
      value: type === "index" ? parseInt(matches[2], 10) : matches[2],
      children: parseJsonPath(matches[3]),
    };
  }
  return null;
}
