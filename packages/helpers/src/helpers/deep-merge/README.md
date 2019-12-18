# deepMerge

deep merge an object to another one. if `source[key]` and `target[key]` are object, will merged ,otherwise replaced.

## Defination

```typescript
/**
 * deep merge an object to another one
 * @param target the object that need to merged to
 * @param source the object that need to merged from
 */
function deepMerge<T extends object, S extends object>(
  target: T,
  source: S,
  ...others: object[]
): T & S {
```

## Usage

```javascript
import { deepMerge } from "@vta/helpers";

function test() {
  const target = {
    framework: "react",
    names: {
      js: "[hash].js",
      css: "[hash].css",
      images: [
        { ext: "png", name: "[hash].png" },
        { ext: "jpg", name: "[hash].jpg" },
      ],
    },
  };

  const merged = deepMerge(
    target,
    {
      framework: "vue",
      names: { js: "[name].js", images: [{ ext: "png", name: "[name].png" }] },
    },
    { names: { css: "[name].css" } },
  );

  console.log(merged.framework); // vue
  console.log(merged.names.js); // [name].js
  console.log(merged.names.css); // [name].css
  console.log(merged.names.images.length); // 1
  // images is not object, it will replace the target value
}
```
