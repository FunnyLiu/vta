export default function clearRequireCache(id: string): void {
  const cache = require.cache[id];
  if (cache) {
    if (cache.parent) {
      const { children } = cache.parent;
      for (let i = 0, len = children.length; i < len; i += 1) {
        if (children[i].id === id) {
          children.splice(i, 1);
          break;
        }
      }
    }
    delete require.cache[id];
  }
}
