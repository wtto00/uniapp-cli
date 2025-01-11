import { execa } from 'execa'
import ora from 'ora'
import { resolveCommand } from 'package-manager-detector/commands'
import which from 'which'
import { App } from './app.js'
import { exists } from './file.js'

/**
 * Remove the color of the output text
 * @param text output text
 */
export function stripAnsiColors(text: string) {
  // biome-ignore lint/suspicious/noControlCharactersInRegex: <explanation>
  return text.replace(/\x1B\[[0-?9;]*[mG]/g, '')
}

export function parseExecaError(error: unknown) {
  return Error((error as { stderr: string }).stderr || (error as { message: string }).message)
}

export async function whichPath(cmd: string) {
  const result = await which(cmd, { nothrow: true })
  if (result) return await exists(result)
  return ''
}

export async function installPackages(packages: string[]) {
  if (packages.length === 0) return

  const pm = App.getPackageManager()
  const commands = resolveCommand(pm.agent, 'add', packages)
  if (!commands) throw Error(`无法转换执行命令: ${pm.agent} add ${packages.join(' ')}`)

  const spinner = ora(`正在安装依赖 ${packages.join(', ')}`).start()
  const { stderr } = await execa`${commands.command} ${commands.args}`
  if (stderr) {
    spinner.fail(`安装依赖 ${packages.join(', ')} 失败了`)
    throw Error
  }
  spinner.succeed(`依赖 ${packages.join(', ')} 安装成功`)
}

export async function uninstallPackages(packages: string[]) {
  if (packages.length === 0) return

  const pm = App.getPackageManager()
  const commands = resolveCommand(pm.agent, 'uninstall', packages)
  if (!commands) throw Error(`无法转换执行命令: ${pm.agent} uninstall ${packages.join(' ')}`)

  const spinner = ora(`正在卸载依赖 ${packages.join(', ')}`).start()
  const { stderr } = await execa`${commands.command} ${commands.args}`
  if (stderr) {
    spinner.fail(`卸载依赖 ${packages.join(', ')} 失败了`)
    throw Error
  }
  spinner.succeed(`依赖 ${packages.join(', ')} 卸载成功`)
}
