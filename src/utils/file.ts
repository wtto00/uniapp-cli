import { existsSync, readFileSync } from 'node:fs'
import { access } from 'node:fs/promises'
import { resolve } from 'node:path'
import JSON5 from 'json5'
import { App } from './app.js'

export function readJsonFile<T extends object>(jsonPath: string, isJson5?: boolean) {
  const fullPath = resolve(App.projectRoot, jsonPath)
  if (!existsSync(fullPath)) {
    throw Error(`读取文件 \`${jsonPath}\` 失败: 文件不存在`)
  }
  const content = readFileSync(fullPath, { encoding: 'utf8' })
  try {
    return (isJson5 ? JSON5 : JSON).parse(content) as T
  } catch {
    throw Error(`解析JSON文件 \`${jsonPath}\` 失败`)
  }
}

export async function exists(filePath?: string) {
  if (!filePath) return false
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}
