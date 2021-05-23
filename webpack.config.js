const path = require('path');

module.exports = {
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'webpack/components'),
      '@utils': path.resolve(__dirname, 'webpack/utils'),
    },
  },
  entry: {
    main: path.resolve(__dirname, 'webpack/index.js'),
    comments: path.resolve(__dirname, 'webpack/comments.js'),
  },
  output: {
    publicPath: '/assets/scripts/',
    path: path.resolve(__dirname, 'src/assets/scripts/'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].[chunkhash].js',
  },
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        loader: 'babel-loader',
        query: {
          presets: [
            [
              '@babel/preset-env',
              {
                bugfixes: true,
              },
            ],
          ],
          plugins: ['@babel/plugin-proposal-nullish-coalescing-operator'],
        },
      },
    ],
  },
};
