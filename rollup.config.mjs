import { defineConfig } from 'rollup'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import nodeExternals from 'rollup-plugin-node-externals'
import terser from '@rollup/plugin-terser'

export default defineConfig([
  {
    input: 'src/index.ts',
    output: { dir: 'dist/esm', format: 'esm' },
    treeshake: 'smallest',
    plugins: [
      nodeExternals(),
      typescript({ module: 'ES2015' }),
      json(),
      nodeResolve({ preferBuiltins: false, exportConditions: ['node'] }),
      commonjs({ extensions: ['.js', '.ts'] }),
      terser()
    ]
  },
  {
    input: 'src/index.ts',
    output: { dir: 'dist/cjs', format: 'commonjs' },
    treeshake: 'smallest',
    plugins: [
      nodeExternals(),
      typescript(),
      json(),
      nodeResolve({ preferBuiltins: false, exportConditions: ['node'] }),
      commonjs({ extensions: ['.js', '.ts'] }),
      terser()
    ]
  }
])
