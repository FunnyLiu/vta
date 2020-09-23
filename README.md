# 源码分析

一个基于tapable的小型但是非常强力的插件cli系统。

插件可以嵌套插件，又基于tapable完成生命周期钩子的绝好案例。

关于tapable的基本用法可以参考[tapableDemo](https://github.com/FunnyLiu/tapableDemo)

## 核心包core

```

└── src
   ├── bin
   |  └── index.js - 命令入口
   ├── core
   |  ├── App.ts - 入口，run，执行插件注册，及核心插件生命周期相关逻辑
   |  ├── ConfigPlugin.ts
   |  ├── index.ts
   |  ├── interface.ts - 定义了插件基类
   |  ├── resolveConfig.ts
   |  └── utils
   |     ├── print-error.ts
   |     ├── resolve-config.ts
   |     ├── standardize-name.spec.ts
   |     └── standardize-name.ts
   ├── index.ts
   ├── plugins
   |  └── fs-watcher-to-restart-plugin.ts - 一个内置插件
   └── scripts
      ├── build.ts
      └── start.ts

```

## 某一个插件plugin-Monorepo

插件、注册子插件、调用生命周期钩子


```
└── src
   ├── index.ts - 入口文件
   ├── interface.ts
   ├── lib
   |  ├── build.js
   |  ├── copy-files.js
   |  └── resolve-packages.js
   ├── plugins
   |  ├── force-publish.ts - 子插件
   |  └── lerna-publish.ts - 子插件
   └── utils
      ├── copied-files-store.js
      ├── packages-sort-by-dependencies.js
      └── test-pkg-matched.js
```



# vta

a pluggable Typescript/Javascript development framework

![npm](https://img.shields.io/npm/v/vta) [![Build Status](https://travis-ci.com/vta-js/vta.svg?branch=master)](https://travis-ci.com/vta-js/vta) [![codecov](https://codecov.io/gh/vta-js/vta/branch/master/graph/badge.svg)](https://codecov.io/gh/vta-js/vta)

## Summary

vta is a pluggable Typescript/Javascript development framework, through some built in plugins you can develop or build your app out of box. when development, if your config system has something changed, the app can automatic restart to apply your new config.

## Install

```bash
yarn add vta --dev
```

## Usage

```json
{
  "presets": [["@vta/react", { "dynamicRoutes": true }]],
  "plugins": [["@vta/typescript", { "project": "tsconfig.build.json" }], ["@vta/webpack"]]
}
```

create a `.vta.json` to specific your used plugins and add some scripts to `package.json`, you can easy develop or build your app. see more info [here](https://github.com/vta-js/vta/tree/master/packages/core)

```json
{
  "scripts": {
    "start": "vta start --env development",
    "build": "vta build --env production"
  }
}
```

## Presets

| name                                                                                            | version                                                  | description         |
| ----------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ------------------- |
| [@vta/preset-webpack](https://github.com/vta-js/preset-webpack)                                 | ![npm](https://img.shields.io/npm/v/@vta/preset-webpack) | add Webpack support |
| [@vta/preset-react](https://github.com/vta-js/preset-webpack/tree/master/packages/preset-react) | ![npm](https://img.shields.io/npm/v/@vta/preset-react)   | add React support   |

## Plugins

| name                                                                                                | version                                                     | description            |
| --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ---------------------- |
| [@vta/plugin-typescript](https://github.com/vta-js/vta/tree/master/packages/plugin-typescript)      | ![npm](https://img.shields.io/npm/v/@vta/plugin-typescript) | add Typescript support |
| [@vta/plugin-webpack](https://github.com/vta-js/preset-webpack/tree/master/packages/plugin-webpack) | ![npm](https://img.shields.io/npm/v/@vta/plugin-webpack)    | add Webpack support    |
| [@vta/plugin-react](https://github.com/vta-js/preset-webpack/tree/master/packages/plugin-react)     | ![npm](https://img.shields.io/npm/v/@vta/plugin-react)      | add React support      |
| [@vta/plugin-monorepo](https://github.com/vta-js/vta/tree/master/packages/plugin-monorepo)          | ![npm](https://img.shields.io/npm/v/@vta/plugin-monorepo)   | add Monorepo support   |

## MIT License
