# deepClone

deep clone an object

## Defination

```typescript
function deepClone<T extends object>(source: T): T;
```

## Usage

```javascript
import { deepClone } from "@vta/helpers";

function test() {
  const source = {
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

  const copied = deepClone(source);

  copied.names.js = "[name].js";
  copied.names.images[0].name = "[name].png";
  console.log(source.names.js); // [hash].js
  console.log(source.names.images[0].name); // [hash].png
}
```
