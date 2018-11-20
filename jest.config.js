module.exports = {
  preset: 'ts-jest',
  testMatch: ['**/*.test.ts'],
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
};
