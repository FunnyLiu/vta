import parseJsonPath, { JSONPath } from "../parse-json-path";

/* eslint-disable no-param-reassign */

function getValueByJsonPathWithDefault(obj, jsonPath: JSONPath) {
  if (jsonPath.children.type === "key") {
    if (Object.prototype.toString.call(obj[jsonPath.value as string]) !== "[object Object]") {
      obj[jsonPath.value as string] = {};
    }
    return obj[jsonPath.value as string];
  }
  if (jsonPath.children.type === "index") {
    if (!Array.isArray(obj[jsonPath.value as number])) {
      obj[jsonPath.value as number] = [];
    }
    return obj[jsonPath.value as number];
  }
  return undefined;
}

function setValueByJsonPath(obj, jsonPath: JSONPath, value) {
  if (jsonPath) {
    if (jsonPath.type === "key") {
      if (Object.prototype.toString.call(obj) === "[object Object]") {
        if (!jsonPath.children) {
          obj[jsonPath.value as string] = value;
        } else {
          setValueByJsonPath(
            getValueByJsonPathWithDefault(obj, jsonPath),
            jsonPath.children,
            value,
          );
        }
      }
    }
    if (jsonPath.type === "index") {
      if (Array.isArray(obj)) {
        if (!jsonPath.children) {
          if (jsonPath.value === -1) {
            obj.push(value);
          } else {
            obj[jsonPath.value as number] = value;
          }
        } else {
          setValueByJsonPath(
            getValueByJsonPathWithDefault(obj, jsonPath),
            jsonPath.children,
            value,
          );
        }
      }
    }
  }
}

/**
 * set value to json by a string path like names[3][8].entry
 * @param json the json object that set to
 * @param path path need to set
 * @param value value need to set
 */
export default function setJsonValue(json: object, path: string, value): void {
  setValueByJsonPath(json, parseJsonPath(path), value);
}
