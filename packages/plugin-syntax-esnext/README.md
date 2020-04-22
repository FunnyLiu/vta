# @vta/plugin-syntax-esnext

a [Vta](https://github.com/vta-js/vta) plugin to **Enable using latest ECMAScript**

![npm](https://img.shields.io/npm/v/@vta/plugin-syntax-esnext) [![Build Status](https://travis-ci.com/vta-js/vta.svg?branch=master)](https://travis-ci.com/vta-js/vta)

## Introduction

this plugin enable using latest ECMAScript engined by [Babel](https://babeljs.io/). automatically regist [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env) and [@babel/plugin-transform-runtime](https://babeljs.io/docs/en/babel-plugin-transform-runtime) according to your package.json.

### preset-env

enabled always

- default **modules** is `false`, you can config this through [options](#options).
- default **useBuiltIns** is `usage` when `core-js` is dependent and no `@babel/runtime-corejs3` or `@babel/runtime-corejs2` is dependent, otherwise `false`.

### plugin-transform-runtime

enabled conditional when `@babel/runtime` or `@babel/runtime-corejs3` or `@babel/runtime-corejs2` is dependent.

## Usage

```json
{
  "plugins": [["@vta/syntax-esnext"]]
}
```

### Options

the options can be passed by [Vta Config System](https://github.com/vta-js/vta/tree/master/packages/core#config-system)

```typescript
export declare interface Options {
  modules: false | "amd" | "umd" | "systemjs" | "commonjs" | "cjs" | "auto";
}
```

#### modules

`@babel/preset-env` [modules](https://babeljs.io/docs/en/babel-preset-env#modules) option. default `false`.

### FAQ

#### browserslist support

the browserslist is fully supported. [how to config](https://github.com/browserslist/browserslist#config-file)

## Vta Feature

regist feature `esnext` with nothing options. only tell other plugins that **esnext** is used.

```typescript
class SyntaxEsnextPlugin extends Plugin {
  prepare(helpers) {
    helpers.registFeature("esnext");
  }
}
```

## MIT License
