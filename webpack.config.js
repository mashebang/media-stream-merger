const path = require('path');

module.exports = {
  entry: {
    index: './src/MediaStreamMerger.js',
  },
  output: {
    filename: 'MediaStreamMerger.js',
    path: path.resolve(__dirname, 'dist'),
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
