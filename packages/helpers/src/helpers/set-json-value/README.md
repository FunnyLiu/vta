# setJsonValue

set value to json by a string path like names[3][8].entry. you can view more detail of the string path [here](../parse-json-path)

## Defination

```typescript
/**
 * set value to json by a string path like names[3][8].entry
 * @param json the json object that set to
 * @param path path need to set
 * @param value value need to set
 * @param mode replace/merge/push and so on, default is replace
 */
function setJsonValue(json: object, path: string, value, mode: Mode = "replace"): void;

export declare type Mode =
  | "replace"
  | "merge"
  | "merge-deep"
  | "push"
  | "unshift"
  | "insert-before"
  | "insert-after"
  | "delete";
```

## Usage

```javascript
import { setJsonValue } from "@vta/helpers";

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

  setJsonValue(json, "framework", "vue");
  console.log(json.framework); // vue

  setJsonValue(json, "names.images[0]", { name: "[name].png" }, "merge-deep");
  console.log(json.names.images[0].name); // [name].png

  setJsonValue(
    json,
    "names.images[visible=false]",
    { ext: "bmp-insert-before", name: "[hash].bmp.before", visible: true },
    "insert-before",
  );
  console.log(json.names.images[1].name); // [hash].bmp.before
  console.log(json.names.images[2].name); // [hash].bmp
}
```
