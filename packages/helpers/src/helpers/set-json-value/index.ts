import parseJsonPath, { JSONPath } from "../parse-json-path";
import { getFiltedItems } from "../read-json-value";
import deepMerge from "../deep-merge";

/* eslint-disable no-param-reassign */

function getValueByJsonPathWithDefault(obj, jsonPath: JSONPath) {
  if (jsonPath.children.type === "key") {
    if (Object.prototype.toString.call(obj[jsonPath.value as string]) !== "[object Object]") {
      obj[jsonPath.value as string | number] = {};
    }
    return obj[jsonPath.value as string | number];
  }
  if (jsonPath.children.type === "index" || jsonPath.children.type === "filter") {
    if (!Array.isArray(obj[jsonPath.value as string | number])) {
      obj[jsonPath.value as string | number] = [];
    }
    return obj[jsonPath.value as string | number];
  }
  return undefined;
}

export declare type Mode =
  | "replace"
  | "merge"
  | "merge-deep"
  | "push"
  | "unshift"
  | "insert-before"
  | "insert-after"
  | "delete";

function setValue(obj, key: string | number, value, mode: Mode) {
  if (mode === "replace") {
    obj[key] = value;
    return;
  }
  if (mode === "merge") {
    if (Object.prototype.toString.call(obj[key]) !== "[object Object]") {
      obj[key] = {};
    }
    if (Object.prototype.toString.call(value) === "[object Object]") {
      Object.keys(value).forEach(k => {
        obj[key][k] = value[k];
      });
      Reflect.ownKeys(value).forEach(k => {
        obj[key][k] = value[k];
      });
    }
    return;
  }
  if (mode === "merge-deep") {
    if (Object.prototype.toString.call(obj[key]) !== "[object Object]") {
      obj[key] = {};
    }
    obj[key] = deepMerge(obj[key], value);
    return;
  }
  if (mode === "push") {
    if (!Array.isArray(obj[key])) {
      obj[key] = [];
    }
    obj[key].push(value);
    return;
  }
  if (mode === "unshift") {
    if (!Array.isArray(obj[key])) {
      obj[key] = [];
    }
    obj[key].unshift(value);
    return;
  }

  // setValueByJsonPath has additional process
  if (mode === "insert-before") {
    if (obj.length <= key) {
      obj[key] = undefined;
    }
    obj.splice(key, 0, value);
    return;
  }
  // setValueByJsonPath has additional process
  if (mode === "insert-after") {
    if (obj.length <= key) {
      obj[key] = undefined;
    }
    obj.splice((key as number) + 1, 0, value);
    return;
  }
  // setValueByJsonPath has additional process
  if (mode === "delete") {
    obj.splice(key, 1);
  }
}

function setValueByJsonPath(obj, jsonPath: JSONPath, value, mode: Mode) {
  // promise Object/Array by entry setJsonValue and getValueByJsonPathWithDefault
  if (jsonPath) {
    if (jsonPath.children && !jsonPath.children.children) {
      if (jsonPath.children.type === "index") {
        if (mode === "insert-before" || mode === "insert-after" || mode === "delete") {
          setValue(
            getValueByJsonPathWithDefault(obj, jsonPath),
            jsonPath.children.value as number,
            value,
            mode,
          );
          return;
        }
      }
    }
    if (jsonPath.type === "key") {
      if (!jsonPath.children) {
        setValue(obj, jsonPath.value as string, value, mode);
      } else {
        setValueByJsonPath(
          getValueByJsonPathWithDefault(obj, jsonPath),
          jsonPath.children,
          value,
          mode,
        );
      }
    } else if (jsonPath.type === "index") {
      if (!jsonPath.children) {
        setValue(obj, jsonPath.value as number, value, mode);
      } else {
        setValueByJsonPath(
          getValueByJsonPathWithDefault(obj, jsonPath),
          jsonPath.children,
          value,
          mode,
        );
      }
    } else if (jsonPath.type === "filter") {
      const indexes = [];
      const filtedItems = getFiltedItems(obj, jsonPath, indexes);
      if (!jsonPath.children) {
        if (mode !== "push") {
          let insertCount = 0;
          for (let i = 0, len = indexes.length; i < len; i += 1) {
            setValue(obj, indexes[i] + insertCount, value, mode);
            if (mode === "insert-before" || mode === "insert-after") {
              insertCount += 1;
            } else if (mode === "delete") {
              insertCount -= 1;
            }
          }
        }
      } else {
        setValueByJsonPath(filtedItems[0], jsonPath.children, value, mode);
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
export default function setJsonValue(
  json: object,
  path: string,
  value,
  mode: Mode = "replace",
): void {
  const jsonPath = parseJsonPath(path);
  if (!json) {
    return;
  }
  if (jsonPath.type === "key" && Object.prototype.toString.call(json) !== "[object Object]") {
    return;
  }
  if ((jsonPath.type === "index" || jsonPath.type === "filter") && !Array.isArray(json)) {
    return;
  }
  setValueByJsonPath(json, jsonPath, value, mode);
}
