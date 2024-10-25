import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { projectRoot } from './path.js'

export function gitIgnorePath(ignorePath: string) {
  const ignoreFilePath = resolve(projectRoot, '.gitignore')
  const content = readFileSync(ignoreFilePath, 'utf8')
  const lines = content.split('\n')
  if (lines.includes(ignorePath)) return
  lines.push(ignorePath, '')
  writeFileSync(ignoreFilePath, lines.join('\n'), 'utf8')
}
