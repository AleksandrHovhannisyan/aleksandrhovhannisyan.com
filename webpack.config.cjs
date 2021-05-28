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
    clean: true,
    publicPath: '/assets/scripts/',
    path: path.resolve(__dirname, 'src/assets/scripts/'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /.m?js$/,
        resolve: {
          // https://github.com/webpack/webpack/issues/11467#issuecomment-691873586
          fullySpecified: false,
        },
        exclude: path.resolve(__dirname, 'node_modules'),
        loader: 'babel-loader',
      },
    ],
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
    },
  },
};
