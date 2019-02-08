import babel from 'rollup-plugin-babel';

export default {
  input: 'src/MediaStreamMerger.js',
  output: {
    file: 'dist/MediaStreamMerger.js',
    format: 'umd',
    name: 'MediaStreamMerger'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
};
