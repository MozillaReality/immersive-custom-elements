import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  input: 'index.js',
  plugins: [
    nodeResolve()
  ],
  output: {
    file: 'build/immersive-custom-elements.js',
    format: 'umd'
  }
}
