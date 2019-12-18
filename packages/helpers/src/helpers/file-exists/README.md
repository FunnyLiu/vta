# fileExists

asynchronous tests whether or not the given path exists by checking with the file system.

## Defination

```typescript
function fileExists(file: string): Promise<boolean>;
```

## Usage

```javascript
import path from "path";
import { fileExists } from "@vta/helpers";

function test() {
  const file = path.resolve(__dirname, "./config/babel.config.js");

  fileExists(file).then(exists => {
    console.log(exists);
  });
}
```
