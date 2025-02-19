import { access } from 'node:fs/promises'

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
