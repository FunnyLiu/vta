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

## MIT License
