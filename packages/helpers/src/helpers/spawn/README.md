# spwan

spawns a new process using the given command, with command line arguments in args. If omitted, args defaults to an empty array.

## Defination

```typescript
function spawn(command: string, options?: SpawnOptions): Promise<Error>;
function spawn(command: string, args?: string[], options?: SpawnOptions): Promise<Error>;
```

## Usage

```javascript
import { spawn } from "@vta/helpers";

export default function tsc() {
  spawn("tsc", ["-p", "tsconfig.build.json"], { cwd: process.cwd() }).then((err) => {
    if (err) {
      console.log("typescript build failed");
    } else {
      console.log("typescript build success");
    }
  });
}
```
