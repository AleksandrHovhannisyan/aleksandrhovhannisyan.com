const path = require('path');

module.exports = {
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
          presets: ['@babel/env'],
        },
      },
    ],
  },
};
