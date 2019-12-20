# vta

a plugable Typescript/Javascript development framework

![npm](https://img.shields.io/npm/v/vta) [![Build Status](https://travis-ci.com/vta-js/vta.svg?branch=master)](https://travis-ci.com/vta-js/vta) [![codecov](https://codecov.io/gh/vta-js/vta/branch/master/graph/badge.svg)](https://codecov.io/gh/vta-js/vta)

## Summary

vta is a plugable Typescript/Javascript development framework, through some built in plugins you can develop or build your app out of box. when development, if your config system has something changed, the app can automatic restart to apply your new config.

## Install

```bash
yarn add vta --dev
```

## Usage

```json
{
  "plugins": [
    ["@vta/typescript", { "project": "tsconfig.build.json" }],
    ["@vta/webpack"],
    ["@vta/react", { "dynamicRoutes": true }]
  ]
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

## Plugins

| name                                                                                           | version                                                     | description            |
| ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ---------------------- |
| [@vta/plugin-typescript](https://github.com/vta-js/vta/tree/master/packages/plugin-typescript) | ![npm](https://img.shields.io/npm/v/@vta/plugin-typescript) | add Typescript support |
| [@vta/plugin-webpack](https://github.com/vta-js/plugin-webpack)                                | ![npm](https://img.shields.io/npm/v/@vta/plugin-webpack)    | add Webpack support    |
| [@vta/plugin-react](https://github.com/vta-js/plugin-react)                                    | ![npm](https://img.shields.io/npm/v/@vta/plugin-react)      | add React support      |

## MIT License
