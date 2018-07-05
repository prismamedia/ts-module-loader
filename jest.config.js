module.exports = {
  globals: {
    'ts-jest': {
      tsConfigFile: 'tsconfig.jest.json',
      ignoreCoverageForAllDecorators: true,
    },
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.tsx?$': './node_modules/ts-jest/preprocessor.js',
  },
  testMatch: ['**/*.test.ts'],
  testEnvironment: 'node',
};
