import { context } from 'esbuild'
import { URL, fileURLToPath } from 'node:url'
import { rmSync } from 'node:fs'

// clare dist
rmSync(fileURLToPath(new URL('../dist', import.meta.url)), { recursive: true, force: true })

context({
  entryPoints: [fileURLToPath(new URL('../src/index.ts', import.meta.url))],
  bundle: true,
  format: 'cjs',
  platform: 'node',
  target: 'node16',
  treeShaking: true,
  loader: { '.ts': 'ts' },
  outfile: fileURLToPath(new URL('../dist/index.cjs', import.meta.url))
}).then(async ctx => {
  await ctx.watch()
}).then(res => {
  console.log('watching...', res)
}).catch(err => {
  console.error(err)
})
