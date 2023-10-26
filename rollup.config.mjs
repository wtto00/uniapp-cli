import { defineConfig } from 'rollup'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

export default defineConfig([
  {
    input: 'src/index.ts',
    output: { dir: 'dist/esm', format: 'esm' },
    plugins: [json(), commonjs({ extensions: ['.js', '.ts'] }), nodeResolve({ preferBuiltins: false }), typescript()]
  },
  {
    input: 'src/index.ts',
    output: { dir: 'dist/cjs', format: 'commonjs' },
    plugins: [typescript(), json(), nodeResolve({ preferBuiltins: false }), commonjs({ extensions: ['.js', '.ts'] })]
  }
])
