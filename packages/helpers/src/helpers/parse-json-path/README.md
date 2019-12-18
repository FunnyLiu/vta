# parseJsonPath

parse a string path like `names[3].plugins[id="runtime"][8].entry` to a JSON object.you can pick a key of json use like `names`, or a zero start index of array use like `[3]`, or filte something from array use like `[age>20]`.multi filter support, must splited by `,`.

> the operator of filter now only support `=,!=,>,>=,<,<=`, left of the operator can be any valid json string path, right of the operator is the comparor value. when the comparor value is a string, it must be wrapped by double quotes

## Defination

```typescript
function parseJsonPath(path: string): JSONPath;

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
```

## Usage

```javascript
import { parseJsonPath } from "@vta/helpers";

function test() {
  const jsonPath = parseJsonPath("names[0]");
  console.log(jsonPath);
  // {type:'key',value:'names',children:{type:'index',value:0}}
}
```

### Filter Notice

if you want to filter a string, the filted string value must be wrapped by double quotes, you can use `JSON.stringify` to do it

```javascript
const path5 = parseJsonPath(`plugins[name=${JSON.stringify('byh,"wy')},city="zz,py"]`);
expect(path5.children.value[0].comparor).toBe('byh,"wy');
```
