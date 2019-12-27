# @vta/plugin-monorepo-builder-tsc

a [vta](https://github.com/vta-js/vta) plugin for build monorepo packages written by Typescript using [@vta/tsc](https://github.com/vta-js/tsc). should working with [@vta/plugin-monorepo](https://github.com/vta-js/vta/tree/master/packages/plugin-monorepo).

![npm](https://img.shields.io/npm/v/@vta/plugin-monorepo-builder-tsc) [![Build Status](https://travis-ci.com/vta-js/vta.svg?branch=master)](https://travis-ci.com/vta-js/vta)

## Main Features

- building source code by typescript
- building source code by babel after typescript build
- support exclude some files to build

## Install

```bash
yarn add @vta/plugin-monorepo @vta/plugin-monorepo-builder-tsc --dev
```

## Usage

```json
{
  "plugins": [["@vta/monorepo"], ["@vta/monorepo-builder-tsc"]]
}
```

## Options

```typescript
import { BuilderOptions } from "@vta/plugin-monorepo";

export declare type Options = BuilderOptions<{
  project?: string;
  babel?: string;
  sourceDir?: string;
  outDir?: string;
  exclude?: string[];
}>;
```

### include

a pattern that **should** build packages through this. same as [@vta/plugin-monorepo](https://github.com/vta-js/vta/tree/master/packages/plugin-monorepo#include)

### exclude

a pattern that **should not** build packages through this. same as [@vta/plugin-monorepo](https://github.com/vta-js/vta/tree/master/packages/plugin-monorepo#exclude)

### options.project

typescript config file. default is `tsconfig.json`. [detail](https://github.com/vta-js/tsc#project--project-p)

### options.babel

babel config file. default is `babel.config.js`. [detail](https://github.com/vta-js/tsc#babel--babel-b--no-babel)

### options.sourceDir

the directory to compile files from. default is `src`. [detail](https://github.com/vta-js/tsc#sourcedir)

### options.outDir

the directory to compile files to. default is `dist`. [detail](https://github.com/vta-js/tsc#outdir--out-dir)

### options.exclude

the patterns of glob to exclude. [detail](https://github.com/vta-js/tsc#exclude--exclude)

## Registed Vta Feature

Nothing

## MIT License
