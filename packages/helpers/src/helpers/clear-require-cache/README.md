# clearRequireCache

in nodejs, when you require one module, it will be cached for next require call, so if you need to require a newer module, you must clear the cache before you require it.

## Defination

```typescript
function clearRequireCache(id: string): void;
```

## Usage

```javascript
import path from "path";
import { clearRequireCache } from "@vta/helpers";

function test() {
  const file = path.resolve(__dirname, "./config/babel.config.js");

  clearRequireCache(file); // clear cache
  const babel = require(file); // require newer
}
```
