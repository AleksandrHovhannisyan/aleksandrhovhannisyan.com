module.exports = {
  presets: ['@babel/preset-env'],
  env: {
    test: {
      plugins: ['@babel/plugin-proposal-nullish-coalescing-operator'],
    },
  },
};
