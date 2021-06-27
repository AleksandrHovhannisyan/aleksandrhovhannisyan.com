module.exports = {
  rootDir: './src/assets/scripts/',
  testMatch: ['**/__tests__/**/*.?(m)js', '**/?(*.)(spec|test).?(m)js'],
  moduleFileExtensions: ['js', 'json', 'node', 'mjs'],
  transform: {
    '^.+.m?js$': 'babel-jest',
  },
};
