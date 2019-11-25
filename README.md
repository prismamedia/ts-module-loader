**Typescript module loader**

[![npm version](https://badge.fury.io/js/%40prismamedia%2Fts-module-loader.svg)](https://badge.fury.io/js/%40prismamedia%2Fts-module-loader) [![github actions status](https://github.com/prismamedia/ts-module-loader/workflows/CI/badge.svg)](https://github.com/prismamedia/ts-module-loader/actions) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

How to load every single modules from a directory?

```
src/
├── index.ts
└── modules/
    ├── Article.ts
    ├── Category.ts
    └── Image.ts
```

The basic idea is to import each module one-by-one. Then list the modules one-by-one to create the map. But what appends when a new module is added to the directory? It must be added twice in the code. That is error prone and a potential source of headache.

```js
// Don't do that

import Article from 'modules/Article';
import Category from 'modules/Category';
import Image from 'modules/Image';

const moduleMap = {
  Article: Article,
  Category: Category,
  Image: Image,
};
```

## Async

```js
import loadModuleMap from '@prismamedia/ts-module-loader';
# or import { loadModuleMap } from '@prismamedia/ts-module-loader';

# [...]

# The simplest call, the result will be a "Map<string, any>"
const moduleMap = await loadModuleMap(`${__dirname}/modules`);

# A call with params
const moduleMap = await loadModuleMap({
  directory: `${__dirname}/modules`,
  include: /^[_A-Za-z][_0-9A-Za-z]*$/,
  strict: true
});

# A call with a known module type/interface, the result will be a "Map<string, ModuleInterface>"
interface ModuleInterface {}
const moduleMap = await loadModuleMap<ModuleInterface>(`${__dirname}/modules`);
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
