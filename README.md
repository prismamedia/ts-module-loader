**Typescript module loader**

[![npm version](https://badge.fury.io/js/%40prismamedia%2Fts-module-loader.svg)](https://badge.fury.io/js/%40prismamedia%2Fts-module-loader) [![CircleCI](https://circleci.com/gh/prismamedia/ts-module-loader/tree/master.svg?style=svg)](https://circleci.com/gh/prismamedia/ts-module-loader/tree/master)

## Async

```js
import loadModuleMap from '@prismamedia/ts-module-loader';
# or import { loadModuleMap } from '@prismamedia/ts-module-loader';

# [...]

const moduleMap = await loadModuleMap(`${__dirname}/modules`);

const moduleMap = await loadModuleMap({
  directory: `${__dirname}/modules`,
  include: /^[_A-Za-z][_0-9A-Za-z]*$/,
  strict: true
});
```

## Sync

```js
import { loadModuleMapSync } from '@prismamedia/ts-module-loader';

# [...]

const moduleMap = loadModuleMapSync(`${__dirname}/modules`);

const moduleMap = loadModuleMapSync({
  directory: `${__dirname}/modules`,
  include: /^[_A-Za-z][_0-9A-Za-z]*$/,
  strict: true
});
```
