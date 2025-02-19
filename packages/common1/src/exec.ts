import which from 'which'
import { exists } from './file.js'

export * from 'execa'

/**
 * 移除命令输出中的颜色代码
 */
export function stripAnsiColors(text: string) {
  // biome-ignore lint/suspicious/noControlCharactersInRegex: <explanation>
  return text.replace(/\x1B\[[0-?9;]*[mG]/g, '')
}

/**
 * catch到的错误转换为字符串
 */
export function parseExecaError(error: unknown) {
  return Error((error as { stderr: string }).stderr || (error as { message: string }).message)
}

/**
 * 查找环境变量中的可执行命令的文件位置
 */
export async function whichPath(cmd: string) {
  const result = await which(cmd, { nothrow: true })
  if (result && (await exists(result))) return result
  return ''
}
