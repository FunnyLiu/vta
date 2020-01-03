function clone(source) {
  if (
    Object.prototype.toString.call(source) === "[object Object]" &&
    source.constructor === {}.constructor
  ) {
    const dest = {};
    Reflect.ownKeys(source).forEach(prop => {
      dest[prop] = clone(source[prop]);
    });
    return dest;
  }
  if (Array.isArray(source)) {
    return source.map(item => clone(item));
  }
  return source;
}
/**
 * deep clone an object
 * @param source the object that needed to be copied
 */
export default function deepClone<T extends object>(source: T): T {
  return clone(source);
}
