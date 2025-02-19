import which from 'which'
import { exists } from './file.js'

/**
 * 查找环境变量中的可执行命令的文件位置
 */
export async function whichPath(cmd: string) {
  const result = await which(cmd, { nothrow: true })
  if (result && (await exists(result))) return result
  return ''
}
