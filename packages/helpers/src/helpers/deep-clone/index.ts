function clone(source) {
  if (Object.prototype.toString.call(source) === "[object Object]") {
    const dest = {};
    Object.keys(source).forEach(prop => {
      dest[prop] = clone(source[prop]);
    });
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
