import moduleLoader from '../';

describe('ModuleLoader', () => {
  it('loads modules map from string', async () =>
    expect(moduleLoader(`${__dirname}/modules`)).resolves.toEqual({
      '0second': expect.anything(),
      first: expect.anything(),
      second: expect.anything(),
    }));

  it('loads modules map from object', async () =>
    expect(moduleLoader({ directory: `${__dirname}/modules` })).resolves.toEqual({
      '0second': expect.anything(),
      first: expect.anything(),
      second: expect.anything(),
    }));

  it('loads modules map from object, with include regexp, not strict', async () =>
    expect(
      moduleLoader({
        directory: `${__dirname}/modules`,
        include: /^[a-zA-Z][_a-zA-Z0-9]*$/,
        strict: false,
      }),
    ).resolves.toEqual({
      first: expect.anything(),
      second: expect.anything(),
    }));

  it('loads modules map from object, with exclude regexp, not strict', async () =>
    expect(
      moduleLoader({
        directory: `${__dirname}/modules`,
        exclude: /^second$/,
        strict: false,
      }),
    ).resolves.toEqual({
      '0second': expect.anything(),
      first: expect.anything(),
    }));

  it('loads modules map from object, with include regexp, strict', async () =>
    expect(
      moduleLoader({
        directory: `${__dirname}/modules`,
        include: /^[a-zA-Z][_a-zA-Z0-9]*$/,
        strict: true,
      }),
    ).rejects.toMatchObject({ message: 'The module "0second.ts" does not have a valid name.' }));

  it('loads modules without default export, not strict', async () =>
    expect(
      moduleLoader({
        directory: `${__dirname}/module-without-default-export`,
        strict: false,
      }),
    ).resolves.toEqual({}));

  it('loads modules without default export, strict', async () =>
    expect(
      moduleLoader({
        directory: `${__dirname}/module-without-default-export`,
        strict: true,
      }),
    ).rejects.toMatchObject({ message: 'The module "first.ts" does not have a default export.' }));

  it('loads modules from missing directory', async () =>
    expect(
      moduleLoader({
        directory: `${__dirname}/missing_modules`,
      }),
    ).resolves.toEqual({}));

  it('loads modules with named export, not strict', async () =>
    expect(
      moduleLoader({
        directory: `${__dirname}/module-with-named-export`,
        exportName: 'test',
        strict: false,
      }),
    ).resolves.toEqual({
      first: expect.anything(),
    }));
});
