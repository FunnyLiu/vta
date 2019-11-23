import parseJsonPath, { JSONPath } from "../parse-json-path";

function readValueByJsonPath(obj, jsonPath: JSONPath) {
  if (jsonPath) {
    if (jsonPath.type === "key") {
      if (Object.prototype.toString.call(obj) === "[object Object]") {
        return readValueByJsonPath(obj[jsonPath.value as string], jsonPath.children);
      }
      return undefined;
    }
    if (jsonPath.type === "index") {
      if (Array.isArray(obj)) {
        return readValueByJsonPath(obj[jsonPath.value as number], jsonPath.children);
      }
      return undefined;
    }
    return undefined;
  }
  return obj;
}

/**
 * read json value from a string path like names[3][8].entry
 * @param json the json object that read from
 * @param path path need to read
 */
export default function readJsonValue<T>(json: object, path: string): T {
  return readValueByJsonPath(json, parseJsonPath(path));
}
