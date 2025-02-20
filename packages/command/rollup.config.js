import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'build/kniw',
      format: 'es',
      plugins: [terser()],
    },
  ],
  plugins: [typescript(), nodeResolve(), commonjs()],
}
