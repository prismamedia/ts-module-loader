import moduleLoader from '../';

describe('ModuleLoader', () => {
  it('loads modules map from string', () => {
    const moduleMap = moduleLoader(`${__dirname}/modules`);

    expect(Object.keys(moduleMap)).toHaveLength(3);
    expect(Object.keys(moduleMap)).toEqual(['0second', 'first', 'second']);
  });

  it('loads modules map from object', () => {
    const moduleMap = moduleLoader({ directory: `${__dirname}/modules` });

    expect(Object.keys(moduleMap)).toHaveLength(3);
    expect(Object.keys(moduleMap)).toEqual(['0second', 'first', 'second']);
  });

  it('loads modules map from object, with include regexp, not strict', () => {
    const moduleMap = moduleLoader({
      directory: `${__dirname}/modules`,
      include: /^[a-zA-Z][_a-zA-Z0-9]*$/,
      strict: false,
    });

    expect(Object.keys(moduleMap)).toHaveLength(2);
    expect(Object.keys(moduleMap)).toEqual(['first', 'second']);
  });

  it('loads modules map from object, with exclude regexp, not strict', () => {
    const moduleMap = moduleLoader({
      directory: `${__dirname}/modules`,
      exclude: /^second$/,
      strict: false,
    });

    expect(Object.keys(moduleMap)).toHaveLength(2);
    expect(Object.keys(moduleMap)).toEqual(['0second', 'first']);
  });

  it('loads modules map from object, with include regexp, strict', () => {
    expect(() =>
      moduleLoader({
        directory: `${__dirname}/modules`,
        include: /^[a-zA-Z][_a-zA-Z0-9]*$/,
        strict: true,
      }),
    ).toThrowError('The module "0second.ts" has not a valid name.');
  });

  it('loads modules from missing directory', () => {
    expect(
      moduleLoader({
        directory: `${__dirname}/missing_modules`,
      }),
    ).toEqual({});
  });
});
