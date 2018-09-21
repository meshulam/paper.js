import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import serve from 'rollup-plugin-serve'

export default {
  input: 'test/index.js',
  output: {
    file: 'test/testbuild.js',
    format: 'iife',
    name: 'paper',
    sourcemap: true,
  },
  plugins: [
    nodeResolve({
      jsnext: true,
      main: true
    }),
    commonjs(),
    serve({
      contentBase: 'test'
    })
  ],
  watch: {
    include: ['src/**', 'test/**'],
  }
}
