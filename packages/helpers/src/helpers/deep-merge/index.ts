import deepClone from "../deep-clone";

function merge(source, target) {
  if (
    Object.prototype.toString.call(source) === "[object Object]" &&
    Object.prototype.toString.call(source) === "[object Object]"
  ) {
    const dest = deepClone(source);
    Object.keys(target).forEach(prop => {
      dest[prop] = merge(source[prop], deepClone(target[prop]));
    });
    Reflect.ownKeys(target).forEach(prop => {
      dest[prop] = merge(source[prop], deepClone(target[prop]));
    });
    return dest;
  }
  return target;
}

/**
 * deep merge an object to another one
 * @param source the object that need to merged to
 * @param target the object that need to merged from
 */
export default function deepMerge<S extends object, T extends object>(source: S, target: T): S & T {
  return merge(source || {}, target || {});
}
