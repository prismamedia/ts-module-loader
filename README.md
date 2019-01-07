**Typescript module loader**

[![npm version](https://badge.fury.io/js/%40prismamedia%2Fts-module-loader.svg)](https://badge.fury.io/js/%40prismamedia%2Fts-module-loader) [![CircleCI](https://circleci.com/gh/prismamedia/ts-module-loader/tree/master.svg?style=svg)](https://circleci.com/gh/prismamedia/ts-module-loader/tree/master)

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

# Usage

```
npm install --save @prismamedia/ts-module-loader
```

## Async

```js
import loadModuleMap from '@prismamedia/ts-module-loader';

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

const moduleMap = loadModuleMapSync(`${__dirname}/modules`);

const moduleMap = loadModuleMapSync({
  directory: `${__dirname}/modules`,
  include: /^[_A-Za-z][_0-9A-Za-z]*$/,
  strict: true
});
```

# Support & Contributions

This package is provided as this by developers at Prisma Media, under license MIT. Issues and Pull Requests are handled on friday by maintainers.
