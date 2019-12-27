# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.0.1](https://github.com/vta-js/vta/compare/v1.0.0...v1.0.1) (2019-12-27)

### Features

- **babel-preset:** support env ([d221695](https://github.com/vta-js/vta/commit/d221695))
- **core:** add exit hook ([659d1a5](https://github.com/vta-js/vta/commit/659d1a5))
- **core:** export silent of app ([288aa14](https://github.com/vta-js/vta/commit/288aa14))
- **core:** support get argument passed by cli ([3cf69e4](https://github.com/vta-js/vta/commit/3cf69e4))
- **core:** support plugin registed after this plugin ([eab5acf](https://github.com/vta-js/vta/commit/eab5acf))
- **core:** support presets ([114295e](https://github.com/vta-js/vta/commit/114295e))
- **core:** use default env as development ([394d59e](https://github.com/vta-js/vta/commit/394d59e))
- **helpers:** add spawn ([19006f8](https://github.com/vta-js/vta/commit/19006f8))
- **plugin-monorepo:** export FeatureOptions and BuilderOptions ([7a67346](https://github.com/vta-js/vta/commit/7a67346))
- **plugin-monorepo:** init ([a79389b](https://github.com/vta-js/vta/commit/a79389b))
- **plugin-monorepo:** support publish ([b3edd7a](https://github.com/vta-js/vta/commit/b3edd7a))
- **plugin-monorepo-builder-tsc:** init ([5eafbf2](https://github.com/vta-js/vta/commit/5eafbf2))

# 1.0.0 (2019-12-20)

### Bug Fixes

- **config:** fix when all config dirs are baseModel ([60c1a8a](https://github.com/vta-js/vta/commit/60c1a8a))
- **config:** if not resolved, save an empty object ([b9da2dd](https://github.com/vta-js/vta/commit/b9da2dd))
- **core:** each app run should use unique configCategory ([f689a4e](https://github.com/vta-js/vta/commit/f689a4e))
- support optional chaining for ts-jest ([f2d20b2](https://github.com/vta-js/vta/commit/f2d20b2))
- **helpers:** remove useless Object.keys ([ae77cce](https://github.com/vta-js/vta/commit/ae77cce))

### Features

- **babel-preset:** init ([d858a43](https://github.com/vta-js/vta/commit/d858a43))
- **config:** add mutate ([1033023](https://github.com/vta-js/vta/commit/1033023))
- **config:** add reset ([4a951b6](https://github.com/vta-js/vta/commit/4a951b6))
- **config:** add useBase and useDeps ([1322b17](https://github.com/vta-js/vta/commit/1322b17))
- **config:** add useValue ([cfb1e01](https://github.com/vta-js/vta/commit/cfb1e01))
- **config:** hooks support merge config by helper ([9f1c8b8](https://github.com/vta-js/vta/commit/9f1c8b8))
- **config:** init ([9012763](https://github.com/vta-js/vta/commit/9012763))
- **config:** optimize hooks ([f619518](https://github.com/vta-js/vta/commit/f619518))
- **config:** set default env to development ([ee9b635](https://github.com/vta-js/vta/commit/ee9b635))
- **config:** support env ([afd5cf3](https://github.com/vta-js/vta/commit/afd5cf3))
- **core:** add feature to support communicate between plugins ([b916ce7](https://github.com/vta-js/vta/commit/b916ce7))
- **core:** export resolveConfig ([d34304b](https://github.com/vta-js/vta/commit/d34304b))
- **core:** export run and runSync ([e8b8cdc](https://github.com/vta-js/vta/commit/e8b8cdc))
- **core:** expose cwd and config for App ([f399a34](https://github.com/vta-js/vta/commit/f399a34))
- **core:** init ([97dc3bf](https://github.com/vta-js/vta/commit/97dc3bf))
- **core:** restart when some configs has changed ([b85c36b](https://github.com/vta-js/vta/commit/b85c36b))
- **core:** set default build dir to dist ([f0be5e4](https://github.com/vta-js/vta/commit/f0be5e4))
- **core:** support env config ([cfc1161](https://github.com/vta-js/vta/commit/cfc1161))
- **helper:** add fileExists ([dfa5261](https://github.com/vta-js/vta/commit/dfa5261))
- **helpers:** add clearRequireCache ([dafb3ec](https://github.com/vta-js/vta/commit/dafb3ec))
- **helpers:** add deepClone and deepMerge ([7301da6](https://github.com/vta-js/vta/commit/7301da6))
- **helpers:** add fileExistsSync and loadModuleSync ([95ddc84](https://github.com/vta-js/vta/commit/95ddc84))
- **helpers:** add loadModule ([6fa3263](https://github.com/vta-js/vta/commit/6fa3263))
- **helpers:** add parseJsonPath read/setJsonValue ([0f914cb](https://github.com/vta-js/vta/commit/0f914cb))
- **helpers:** deepMerge support others by argument spread ([af17e8d](https://github.com/vta-js/vta/commit/af17e8d))
- **helpers:** parseJsonPath support filter ([71ab509](https://github.com/vta-js/vta/commit/71ab509))
- **helpers:** readJsonValue support filter ([debc1a7](https://github.com/vta-js/vta/commit/debc1a7))
- **helpers:** setJsonValue support filter ([941403e](https://github.com/vta-js/vta/commit/941403e))
- **helpers:** setJsonValue support unshift mode ([f334d8a](https://github.com/vta-js/vta/commit/f334d8a))
- **internal:** exit when build error ([dc02e73](https://github.com/vta-js/vta/commit/dc02e73))
- **internal:** resort packages by dependencies ([12b1e5c](https://github.com/vta-js/vta/commit/12b1e5c))
- **internal:** support optional chaining ([ebe5792](https://github.com/vta-js/vta/commit/ebe5792))
- **internal:** support peerDependencies order ([4aac7e9](https://github.com/vta-js/vta/commit/4aac7e9))
- **internal:** use package's babel-runtime and core-js to build ([0fbca32](https://github.com/vta-js/vta/commit/0fbca32))
- **plugin-typescript:** init ([63cb524](https://github.com/vta-js/vta/commit/63cb524))
- **plugin-typescript:** regist babel/preset-typescript export tsconfig ([9c4b1b1](https://github.com/vta-js/vta/commit/9c4b1b1))
- **plugin-typescript:** support vue plugin ([e63944f](https://github.com/vta-js/vta/commit/e63944f))
