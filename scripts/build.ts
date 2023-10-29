import esbuild from 'esbuild'
import { URL, fileURLToPath } from 'node:url'
import { rmSync } from 'node:fs'

// clare dist
rmSync(fileURLToPath(new URL('../dist', import.meta.url)), { recursive: true, force: true })

// build cjs
esbuild.buildSync({
  entryPoints: [fileURLToPath(new URL('../src/index.ts', import.meta.url))],
  bundle: true,
  minify: true,
  format: 'cjs',
  platform: 'node',
  target: 'node16',
  treeShaking: true,
  loader: { '.ts': 'ts' },
  outfile: fileURLToPath(new URL('../dist/index.cjs', import.meta.url))
})

// build esm
void esbuild.build({
  entryPoints: [fileURLToPath(new URL('../src/index.ts', import.meta.url))],
  bundle: true,
  minify: true,
  format: 'esm',
  platform: 'node',
  target: 'node16',
  treeShaking: true,
  loader: { '.ts': 'ts' },
  outfile: fileURLToPath(new URL('../dist/index.mjs', import.meta.url))
})
