import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

export function gitIgnorePath(ignorePath: string) {
  const ignoreFilePath = resolve(global.projectRoot, '.gitignore')
  const content = readFileSync(ignoreFilePath, 'utf8')
  const lines = content.split('\n')
  if (lines.includes(ignorePath)) return
  lines.push('', ignoreFilePath)
  writeFileSync(ignoreFilePath, lines.join('\n'), 'utf8')
}
