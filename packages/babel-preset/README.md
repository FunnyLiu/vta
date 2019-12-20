# @vta/babel-preset

resolve user's babel config of [vta](https://github.com/vta-js/vta). this package can get all registed plugin's babel config and user's config through [resolveConfig](https://github.com/vta-js/vta/tree/master/packages/core#resolveconfig).

![npm](https://img.shields.io/npm/v/@vta/babel-preset) [![Build Status](https://travis-ci.com/vta-js/vta.svg?branch=master)](https://travis-ci.com/vta-js/vta)

## Why

As of the [babel-eslint](https://github.com/babel/babel-eslint) v11.x.x release, babel-eslint now requires Babel as a peer dependency and expects a valid Babel configuration file to exist. This ensures that the same Babel configuration is used during both linting and compilation

## Install

```bash
yarn add @vta/babel-preset --dev
```

## Usage

```javascript
// babel.config.js
module.exports = {
  presets: ["@vta"],
};
```

## MIT License
