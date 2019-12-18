# loadModule

asynchronous load module of the given path, if not exists, return the default value passed to.

## Defination

```typescript
function loadModule<T>(file: string, def?: T): Promise<T>;
```

## Usage

```javascript
import path from "path";
import { loadModule } from "@vta/helpers";

function test() {
  const file = path.resolve(__dirname, "./config/babel.config.js");

  loadModule(file, {}).then(config => {
    console.log(config);
  });
}
```
