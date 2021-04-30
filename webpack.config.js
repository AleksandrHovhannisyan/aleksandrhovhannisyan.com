const path = require('path');

module.exports = {
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'webpack/components'),
      utils: path.resolve(__dirname, 'webpack/utils'),
    },
  },
  entry: './webpack/index.js',
  output: {
    path: path.resolve(__dirname, 'src/assets/scripts/'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: [path.resolve(__dirname, 'node_modules')],
        loader: 'babel-loader',
        query: {
          presets: [
            [
              '@babel/preset-env',
              {
                "bugfixes": true
              }
            ]
          ],
          plugins: ['@babel/plugin-proposal-nullish-coalescing-operator'],
        },
      },
    ],
  },
};
