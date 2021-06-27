const path = require('path');

module.exports = {
  context: path.resolve(__dirname, './src/assets/scripts'),
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/assets/scripts/components/index.mjs'),
      '@utils': path.resolve(__dirname, './src/assets/scripts/utils/index.mjs'),
    },
  },
  entry: {
    main: './index.mjs',
    comments: './comments.mjs',
  },
  output: {
    clean: true,
    publicPath: '/assets/scripts/',
    path: path.resolve(__dirname, './_site/assets/scripts/'),
    filename: '[name].bundle.mjs',
    chunkFilename: '[name].bundle.mjs',
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
