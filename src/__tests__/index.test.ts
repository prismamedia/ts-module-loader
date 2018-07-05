import moduleLoader from '../';

describe('ModuleLoader', () => {
  it('loads valid module map from string', () => {
    const moduleMap = moduleLoader(`${__dirname}/validModules`);

    expect(Object.keys(moduleMap)).toHaveLength(2);
    expect(Object.keys(moduleMap)).toEqual(['first', 'second']);
  });

  it('loads valid module map from object', () => {
    const moduleMap = moduleLoader({ directory: `${__dirname}/validModules` });

    expect(Object.keys(moduleMap)).toHaveLength(2);
    expect(Object.keys(moduleMap)).toEqual(['first', 'second']);
  });

  it('loads mixed module map from object not strict', () => {
    const moduleMap = moduleLoader({ directory: `${__dirname}/mixedModules`, strict: false });

    expect(Object.keys(moduleMap)).toHaveLength(1);
    expect(Object.keys(moduleMap)).toEqual(['first']);
  });

  it('loads mixed module map from object strict', () => {
    expect(() => moduleLoader({ directory: `${__dirname}/mixedModules`, strict: true })).toThrowError(
      'The module "0second.ts" has not a valid name.',
    );
  });
});
