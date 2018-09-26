import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import serve from 'rollup-plugin-serve'

export default {
  input: 'test/index.js',
  output: {
    file: 'test/testbuild.js',
    format: 'iife',
    name: 'paper',
    sourcemap: true,
    globals: {
      canvas: 'null',
    }
  },
  external: [
    'canvas'
  ],
  plugins: [
    nodeResolve({
      jsnext: true,
      main: true
    }),
    commonjs(),
    json(),
    serve({
      contentBase: 'test'
    })
  ],
  watch: {
    include: ['src/**', 'test/**'],
  }
}
