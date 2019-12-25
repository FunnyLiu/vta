# @vta/helpers

some helpers to use

![npm](https://img.shields.io/npm/v/@vta/helpers) [![Build Status](https://travis-ci.com/vta-js/vta.svg?branch=master)](https://travis-ci.com/vta-js/vta)

## Install

```bash
yarn add @vta/helpers
```

## Helpers

- [clearRequireCache](https://github.com/vta-js/vta/tree/master/packages/helpers/src/helpers/clear-require-cache): clear nodejs module system cache
- [deepClone](https://github.com/vta-js/vta/tree/master/packages/helpers/src/helpers/deep-clone): deep clone an object
- [deepMerge](https://github.com/vta-js/vta/tree/master/packages/helpers/src/helpers/deep-merge): deep merge an object to another one
- [fileExists](https://github.com/vta-js/vta/tree/master/packages/helpers/src/helpers/file-exists): asynchronous tests whether or not the given path exists
- [fileExistsSync](https://github.com/vta-js/vta/tree/master/packages/helpers/src/helpers/file-exists-sync): synchronous tests whether or not the given path exists
- [loadModule](https://github.com/vta-js/vta/tree/master/packages/helpers/src/helpers/load-module): asynchronous load module of the given path
- [loadModuleSync](https://github.com/vta-js/vta/tree/master/packages/helpers/src/helpers/load-module-sync): synchronous load module of the given path
- [parseJsonPath](https://github.com/vta-js/vta/tree/master/packages/helpers/src/helpers/parse-json-path): parse a string path like `names[3].plugins[id="runtime"][8].entry` to a JSON object
- [readJsonValue](https://github.com/vta-js/vta/tree/master/packages/helpers/src/helpers/read-json-value): read json value from a string path like `names[3][8].entry`
- [setJsonValue](https://github.com/vta-js/vta/tree/master/packages/helpers/src/helpers/set-json-value): set value to json by a string path like names[3][8].entry
- [spawn](https://github.com/vta-js/vta/tree/master/packages/helpers/src/helpers/spawn): spawns a new process using the given command, with command line arguments in args.

## MIT License
