import parseJsonPath, { JSONPath, Filter } from "../parse-json-path";

/* eslint-disable @typescript-eslint/no-use-before-define */

function matchFilter(obj, filter: Filter): boolean {
  if (filter && filter.target) {
    const value = readValueByJsonPath(obj, filter.target);
    const { operator, comparor } = filter;
    if (operator === "=") {
      return value === comparor;
    }
    if (operator === "!=") {
      return value !== comparor;
    }
    if (operator === ">") {
      return value > comparor;
    }
    if (operator === ">=") {
      return value >= comparor;
    }
    if (operator === "<") {
      return value < comparor;
    }
    if (operator === "<=") {
      return value <= comparor;
    }
  }
  return false;
}

function matchFilters(obj, filters: Filter[]): boolean {
  let matched = true;
  for (let i = 0, len = filters.length; i < len; i += 1) {
    const filter = filters[i];
    if (filter.target.type === "filter") {
      if (
        getFiltedItems([obj], filter.target).length === 0 ||
        !matchFilter(obj, {
          target: filter.target.children,
          operator: filter.operator,
          comparor: filter.comparor,
        })
      ) {
        matched = false;
        break;
      }
    } else if (!matchFilter(obj, filters[i])) {
      matched = false;
      break;
    }
  }
  return matched;
}

export function getFiltedItems(items, jsonPath: JSONPath) {
  if (jsonPath && jsonPath.type === "filter") {
    const filters = jsonPath.value as Filter[];
    const filtedItems = [];
    for (let i = 0, len = items.length; i < len; i += 1) {
      const item = items[i];
      if (matchFilters(item, filters)) {
        filtedItems.push(item);
      }
    }
    return filtedItems;
  }
  return items;
}

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
    if (jsonPath.type === "filter") {
      if (Array.isArray(obj)) {
        const filtedItems = getFiltedItems(obj, jsonPath);
        if (jsonPath.children) {
          return readValueByJsonPath(filtedItems[0], jsonPath.children);
        }
        return filtedItems;
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
