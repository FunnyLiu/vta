import deepClone from "../deep-clone";

function merge(target, source) {
  if (
    Object.prototype.toString.call(target) === "[object Object]" &&
    Object.prototype.toString.call(source) === "[object Object]"
  ) {
    const dest = deepClone(target);
    Reflect.ownKeys(source).forEach(prop => {
      dest[prop] = merge(target[prop], deepClone(source[prop]));
    });
    return dest;
  }
  return source;
}

/**
 * deep merge an object to another one
 * @param target the object that need to merged to
 * @param source the object that need to merged from
 */
export default function deepMerge<T extends object, S extends object>(
  target: T,
  source: S,
  ...others: object[]
): T & S {
  let result = merge(target || {}, source || {});
  others.forEach(other => {
    if (other) {
      result = merge(result, other);
    }
  });
  return result;
}
