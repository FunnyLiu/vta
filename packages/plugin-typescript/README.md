# @vta/plugin-typescript

typescript plugin for [vta](https://github.com/vta-js/vta)

![npm](https://img.shields.io/npm/v/@vta/plugin-typescript) [![Build Status](https://travis-ci.com/vta-js/vta.svg?branch=master)](https://travis-ci.com/vta-js/vta)

## Main Features

- regist [@babel/preset-typescript](https://babeljs.io/docs/en/babel-preset-typescript) for **babel**
- build source code through [@vta/tsc](https://github.com/vta-js/tsc) **if not using webpack**
- export a base tsconfig for you to extend. `@vta/plugin-typescript/tsconfig`

## Install

```bash
yarn add @vta/plugin-typescript --dev
```

## Usage

```json
{
  "plugins": [["@vta/typescript"]]
}
```

## Options

```typescript
export declare interface Options {
  project?: string;
  exclude?: string[];
}
```

### project

typescript config file. default `tsconfig.json`

### exclude

the patterns of [glob](https://github.com/isaacs/node-glob) to exclude.

## Registed Vta Feature

regist feature `typescript` with nothing options. only tell other plugins that **typescript** is used.

```typescript
class TypescriptPlugin extends Plugin {
  prepare(helpers) {
    helpers.registFeature("typescript");
  }
}
```

## MIT License
