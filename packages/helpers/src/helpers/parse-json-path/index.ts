export declare interface JSONPath {
  type: "key" | "index" | "filter";
  value: string | number | Filter[];
  children?: JSONPath;
}

export declare interface Filter {
  target: JSONPath;
  operator: "=" | "!=" | ">" | ">=" | "<" | "<=";
  comparor: string | number | boolean | null | undefined;
}

export function getMatches(path: string): ["." | "[", string, string] {
  if (!path) {
    return null;
  }
  if (path[0] === "[") {
    let position = 1;
    let end: number;
    let nextPosition = 1;
    let next: number;
    let count = 0;
    do {
      end = path.indexOf("]", position);
      position = end + 1;
      next = path.indexOf("[", nextPosition);
      nextPosition = next + 1;
      count += 1;
    } while (next > 0 && next < end && count < 10);
    return ["[", path.substring(1, end), path.substring(end + 1)];
  }
  const matches = /^\.?([^.[]+)(.*)$/.exec(path);
  if (matches) {
    return [".", matches[1], matches[2]];
  }
  return null;
}

/* eslint-disable @typescript-eslint/no-use-before-define */

export function parseFilter(filter: string): Filter {
  let filterWrapLastQuote = filter;
  if (filter[filter.length - 1] === '"') {
    let quoteIdx = null;
    let position = filter.length - 2;
    do {
      position = filter.lastIndexOf('"', position);
      if (filter[position - 1] !== "\\") {
        quoteIdx = position;
      } else {
        position -= 1;
      }
    } while (quoteIdx === null);
    filterWrapLastQuote = filter.slice(0, quoteIdx);
  }

  const operators = ["!=", ">=", "<=", "=", ">", "<"];
  let operator;
  let opIdx = 0;
  for (let i = 0, len = operators.length; i < len; i += 1) {
    const matches = new RegExp(
      `${operators[i]}((?:-?\\d+\\.?\\d*)|(?:true|false|undefined|null))?$`,
    ).exec(filterWrapLastQuote);
    if (matches) {
      const idx = matches.index;
      if (idx < opIdx || opIdx === 0) {
        opIdx = idx;
        operator = operators[i];
      }
    }
  }
  if (operator) {
    const target = filter.substring(0, opIdx);
    const comparor = filter.substring(opIdx + operator.length);
    return { target: parseJsonPath(target), operator, comparor: JSON.parse(comparor) };
  }
  return null;
}

/**
 * parse a string path like names[3][8].entry to a JSON object
 * @param path path need to parse
 */
function parseJsonPath(path: string): JSONPath {
  const matches = getMatches(path);
  if (matches) {
    if (matches[0] === ".") {
      return { type: "key", value: matches[1], children: parseJsonPath(matches[2]) };
    }
    if (matches[0] === "[") {
      if (/^-?\d+$/.test(matches[1])) {
        return {
          type: "index",
          value: parseInt(matches[1], 10),
          children: parseJsonPath(matches[2]),
        };
      }
      const comma = "_-945__comma__523-_";
      return {
        type: "filter",
        value: matches[1]
          .replace(/(["])(.+?)(?<!\\)\1/g, (input, c, v) => {
            return `${c}${v.replace(/,/g, comma)}${c}`;
          })
          .split(",")
          .map(filter => parseFilter(filter.replace(new RegExp(comma, "g"), ","))),
        children: parseJsonPath(matches[2]),
      };
    }
  }
  return null;
}

export default parseJsonPath;
