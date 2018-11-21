import each from 'jest-each';
import { loadModuleMap, loadModuleMapSync } from '../';

describe('ModuleLoader', () => {
  each([
    // loads modules map from string
    [
      `${__dirname}/modules`,
      {
        '0second': expect.anything(),
        first: expect.anything(),
        second: expect.anything(),
      },
    ],
    // loads modules map from object
    [
      { directory: `${__dirname}/modules` },
      {
        '0second': expect.anything(),
        first: expect.anything(),
        second: expect.anything(),
      },
    ],
    // loads modules map from object, with include regexp, not strict
    [
      {
        directory: `${__dirname}/modules`,
        include: /^[a-zA-Z][_a-zA-Z0-9]*$/,
        strict: false,
      },
      {
        first: expect.anything(),
        second: expect.anything(),
      },
    ],
    // loads modules map from object, with exclude regexp, not strict
    [
      {
        directory: `${__dirname}/modules`,
        exclude: /^second$/,
        strict: false,
      },
      {
        '0second': expect.anything(),
        first: expect.anything(),
      },
    ],
    // loads modules without default export, not strict
    [
      {
        directory: `${__dirname}/module-without-default-export`,
        strict: false,
      },
      {},
    ],
    // loads modules from missing directory
    [
      {
        directory: `${__dirname}/missing_modules`,
      },
      {},
    ],
    // loads modules with named export, not strict
    [
      {
        directory: `${__dirname}/module-with-named-export`,
        exportName: 'test',
        strict: false,
      },
      {
        first: expect.anything(),
      },
    ],
  ]).test('loads modules', async (config, result, done) => {
    // Test Async
    await expect(loadModuleMap(config)).resolves.toEqual(new Map(Object.entries(result)));

    // Test Sync
    expect(loadModuleMapSync(config)).toEqual(new Map(Object.entries(result)));

    done();
  });

  each([
    // loads modules map from object, with include regexp, strict
    [
      {
        directory: `${__dirname}/modules`,
        include: /^[a-zA-Z][_a-zA-Z0-9]*$/,
        strict: true,
      },
      'The module "0second.ts" does not have a valid name.',
    ],
    // loads modules without default export, strict
    [
      {
        directory: `${__dirname}/module-without-default-export`,
        strict: true,
      },
      'The module "first.ts" does not have a default export.',
    ],
  ]).test('fails', async (config, message, done) => {
    // Test Async
    await expect(loadModuleMap(config)).rejects.toMatchObject({ message });

    // Test Sync
    expect(() => loadModuleMapSync(config)).toThrowError(message);

    done();
  });
});
