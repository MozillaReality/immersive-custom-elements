import nodeResolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default [{
  input: 'index.js',
  plugins: [
    nodeResolve()
  ],
  output: {
    file: 'build/immersive-custom-elements.js',
    format: 'umd'
  }
}, {
  input: 'build/immersive-custom-elements.js',
  plugins: [
    terser()
  ],
  output: {
    file: 'build/immersive-custom-elements.min.js',
    format: 'umd'
  }
}]
