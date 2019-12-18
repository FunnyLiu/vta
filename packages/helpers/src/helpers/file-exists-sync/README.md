# fileExistsSync

synchronous tests whether or not the given path exists by checking with the file system.

## Defination

```typescript
function fileExistsSync(file: string): boolean;
```

## Usage

```javascript
import path from "path";
import { fileExistsSync } from "@vta/helpers";

function test() {
  const file = path.resolve(__dirname, "./config/babel.config.js");

  const exists = fileExistsSync(file);
  console.log(exists);
}
```
