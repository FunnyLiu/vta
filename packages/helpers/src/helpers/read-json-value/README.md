# readJsonValue

read json value from a string path like `names[3][8].entry`. you can view more detail of the string path [here](../parse-json-path)

> if a filter not followed by any json path, will return all filted items, otherwise will return the result of `readJsonValue(filtedItems[0],followPath)`

## Defination

```typescript
/**
 * read json value from a string path like names[3][8].entry
 * @param json the json object that read from
 * @param path path need to read
 */
function readJsonValue<T>(json: object, path: string): T;
```

## Usage

```javascript
import { readJsonValue } from "@vta/helpers";

function test() {
  const json = {
    framework: "react",
    names: {
      js: "[hash].js",
      css: "[hash].css",
      images: [
        { ext: "png", name: "[hash].png", visible: true },
        { ext: "bmp", name: "[hash].bmp", visible: false },
        { ext: "jpg", name: "[hash].jpg", visible: true },
      ],
    },
  };

  console.log(readJsonValue(json, "framework")); // react
  console.log(readJsonValue(json, "names.js")); // [hash].js
  console.log(readJsonValue(json, "names.images[1]")); // { ext: "bmp" ... }
  console.log(readJSONValue(json, "names.images[visible=true]")); // {ext: "png",...}, {ext: "jpg",...}
  console.log(readJSONValue(json, "names.images[visible=true].name")); // [hash].png
}
```
