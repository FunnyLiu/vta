# loadModuleSync

synchronous load module of the given path, if not exists, return the default value passed to.

## Defination

```typescript
function loadModuleSync<T>(file: string, def?: T): T;
```

## Usage

```javascript
import path from "path";
import { loadModuleSync } from "@vta/helpers";

function test() {
  const file = path.resolve(__dirname, "./config/babel.config.js");

  const config = loadModuleSync(file, {});
  console.log(config);
}
```
