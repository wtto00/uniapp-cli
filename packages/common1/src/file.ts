import { access, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import JSON5 from 'json5'
import { App } from './app.js'
import { errorDebugLog } from './error.js'

/**
 * 读取json文件
 */
export async function readJsonFile<T extends object>(jsonPath: string) {
  if (!(await exists(jsonPath))) throw Error(`读取文件 \`${jsonPath}\` 失败: 文件不存在`)
  const content = await readFile(jsonPath, 'utf8')
  try {
    return JSON5.parse(content) as T
  } catch (error) {
    errorDebugLog(error)
    throw Error(`解析JSON文件 \`${jsonPath}\` 失败`)
  }
}

/**
 * 编辑更改json文件。
 * 注意：会丢失注释
 */
export async function editJsonFile<T extends object>(jsonPath: string, callback: (data: T) => void | Promise<void>) {
  const json = await readJsonFile<T>(jsonPath)
  await Promise.resolve(callback(json))
  await writeFile(jsonPath, JSON5.stringify(json, { space: 2, quote: '"' }), 'utf8')
}

/**
 * 根据模板中的文件，清理目标目录内多余的文件
 * @param origin 模板目录
 * @param target 要清理的目录
 * @param keep 保留的目录
 */
export async function cleanFiles(origin: string, target: string, keep: string[] = []) {
  const files = await readdir(target)
  for (const file of files) {
    if (keep.includes(file)) continue
    const targetFilePath = join(target, file)
    const originFilePath = join(origin, file)
    if (!(await exists(originFilePath))) {
      await rm(targetFilePath, { recursive: true, force: true })
      continue
    }
    const info = await stat(targetFilePath)
    if (info.isDirectory()) {
      await cleanFiles(originFilePath, targetFilePath)
    }
  }
}

/**
 * 文件或目录是否存在
 */
export async function exists(filePath?: string) {
  if (!filePath) return false
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

export async function importFileModule<T extends object>(filePath: string) {
  const fullPath = join(App.projectRoot, filePath)
  if (!(await exists(fullPath))) {
    throw Error(`出错了：文件 ${filePath} 不存在`)
  }
  return (await import(pathToFileURL(fullPath).href)) as T
}
