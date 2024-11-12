import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { App } from './app.js'

export function gitIgnorePath(ignorePath: string) {
  const ignoreFilePath = resolve(App.projectRoot, '.gitignore')
  const content = existsSync(ignoreFilePath) ? readFileSync(ignoreFilePath, 'utf8') : 'node_modules\ndist'
  const lines = content.split('\n')
  if (lines.includes(ignorePath)) return
  lines.push(ignorePath, '')
  writeFileSync(ignoreFilePath, lines.join('\n'), 'utf8')
}

/**
 * - https://github.com/user/repo
 * - git@github.com:user/repo
 * - ssh://git@hostname:port/user/repo.git
 * - user/repo
 */
export function getTemplateRepositoryUrl(repo: string) {
  if (/^[0-9a-zA-Z]+(-[0-9a-zA-Z]+)*\/[\w\.\-]+$/.test(repo)) {
    return `https://github.com/${repo}`
  }
  return repo
}
