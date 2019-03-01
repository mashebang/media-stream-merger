const path = require('path');

module.exports = {
  entry: {
    index: './src/MediaStreamMerger.js',
  },
  output: {
    filename: 'MediaStreamMerger.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'MediaStreamMerger',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader?cacheDirectory=true',
      }
    ]
  }
};
