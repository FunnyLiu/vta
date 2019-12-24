# @vta/plugin-monorepo

a [vta](https://github.com/vta-js/vta) plugin for menorepo that powered by lerna or yarn workspace

![npm](https://img.shields.io/npm/v/@vta/plugin-monorepo) [![Build Status](https://travis-ci.com/vta-js/vta.svg?branch=master)](https://travis-ci.com/vta-js/vta)

## Main Features

- copy files to each package before building. [detail](#copy-files)
- build source code for each package. [detail](#build-source-code)
- delete all copied files after published. [detail](#delete-copied-files)

## Install

```bash
yarn add @vta/plugin-monorepo --dev
```

## Usage

```json
{
  "plugins": [["@vta/monorepo"]]
}
```

## Options

```typescript
export declare interface Options {
  packages?: string;
  filesToCopy?: FileToCopy[];
  noPublish?: boolean;
  changelog?: boolean;
  release?: "github" | "gitlab";
  registry?: string;
}
```

### packages

the packages directory. default `packages`

### filesToCopy

the files that need to be copied to each package. default empty

### publish

if `true`, we will publish to npm. default `true`

### changelog

if `true`, we will use the [Conventional Commits Specification](https://conventionalcommits.org/) to generate CHANGELOG.md files. default `true`. [detail](https://github.com/lerna/lerna/tree/master/commands/version#--conventional-commits)

### release

if `true`, we will create an official GitHub or GitLab release based on the changed packages, requires `changelog` to be `true`. default `true`. [detail](https://github.com/lerna/lerna/tree/master/commands/version#--create-release-type)

### registry

the registry of packages to publish. default `https://registry.npmjs.org`

## Registed Vta Feature

regist feature `monorepo` with a options that has a `registBuilder` function to regist source code builder

```typescript
export declare type Builder = (pkg: Pkg, options?: { [key: string]: any }) => Promise<Error>;

export declare interface BuilderOptions {
  include?: RegExp | string;
  exclude?: RegExp | string;
  options?: { [key: string]: any };
}

export declare interface FeatureOptions {
  registBuilder(builder: Builder, options?: BuilderOptions): void;
}
```

## Copy Files

```typescript
export declare type FileToCopy =
  | string
  | {
      src: string;
      dest?: string | ((pkg: string) => string);
      include?: RegExp | string;
      exclude?: RegExp | string;
    };
```

you should specific the `filesToCopy` option to an array of `FileToCopy`. it can be a `string` or an `object`. if it is a `string`,we will use it as **src** of one object.

### src

the file path that need to be copied from. relative to current working directory.

### dest

the file path that need to be copied to. relative to package directory. default **src**. if this is a function, it will receive current package's directory `pkg` and should return a string file path.

### include

the packages that need to be copied to. a `RegExp` or `RegExp string`. default `true`.

### exclude

the packages that should not to be copied to. a `RegExp` or `RegExp string`. default `false`.

## Build Source Code

firstly, you should install a `monorepo-builder-` plugin. it will use the registed vta feature to build your source code. you can specific the `include`,`exclude`,`options` of the builder's options. usage like below.

```json
{
  "plugins": [
    ["@vta/monorepo", { "filesToCopy": ["LICENSE"] }],
    [
      "@vta/monorepo-builder-tsc",
      { "include": "ts-", "options": { "project": "tsconfig.build.json" } }
    ]
  ]
}
```

## Delete Copied Files

when app has processed done. we will automatically delete all copied files.

## MIT License
