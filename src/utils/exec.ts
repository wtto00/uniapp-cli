import { execa } from 'execa'
import ora from 'ora'
import { resolveCommand } from 'package-manager-detector'
import { App } from './app.js'
import Log from './log.js'

/**
 * Remove the color of the output text
 * @param text output text
 */
export function stripAnsiColors(text: string) {
  // biome-ignore lint/suspicious/noControlCharactersInRegex: <explanation>
  return text.replace(/\x1B\[[0-?9;]*[mG]/g, '')
}

export function getErrorMessage(error: unknown) {
  return (error as { stderr: string }).stderr || (error as { message: string }).message
}

/**
 * `@vue/cli` has been installed or not
 */
export async function isVueCliInstalled() {
  const { stdout } = await execa`vue`
  return stdout.includes('Usage: vue')
}

export async function installVueCli() {
  const spinner = ora('@vue/cli 没有安装，开始全局安装 @vue/cli').start()
  const { stderr } = await execa`npm i -g @vue/cli`
  if (stderr) {
    spinner.fail(`全局安装 @vue/cli 失败了: ${stderr}`)
    throw Error
  }

  if (await isVueCliInstalled()) {
    spinner.succeed('@vue/cli 已成功全局安装。')
  }
}

export async function createVueProject(appName: string, template: string, force = false) {
  Log.debug('开始使用@vue/cli创建应用')
  await execa({ stdio: 'inherit' })`vue create -p ${template} ${appName} ${force ? '--force' : ''}`
}

export async function installPackages(packages: string[]) {
  const pm = App.getPackageManager()
  const commands = resolveCommand(pm.agent, 'add', packages)
  if (!commands) throw Error(`无法转换执行命令: ${pm.agent} add ${packages.join(' ')}`)

  const spinner = ora(`正在安装依赖 ${packages.join(', ')}`).start()
  const { stderr } = await execa`${commands.command} ${commands.args}`
  if (stderr) {
    spinner.fail(`安装依赖 ${packages.join(', ')} 失败了。`)
    throw Error
  }
  spinner.succeed(`依赖 ${packages.join(', ')} 安装成功。`)
}

export async function uninstallPackages(packages: string[]) {
  const pm = App.getPackageManager()
  const commands = resolveCommand(pm.agent, 'uninstall', packages)
  if (!commands) throw Error(`无法转换执行命令: ${pm.agent} uninstall ${packages.join(' ')}`)

  const spinner = ora(`正在卸载依赖 ${packages.join(', ')}`).start()
  const { stderr } = await execa`${commands.command} ${commands.args}`
  if (stderr) {
    spinner.fail(`卸载依赖 ${packages.join(', ')} 失败了。`)
    throw Error
  }
  spinner.succeed(`依赖 ${packages.join(', ')} 卸载成功。`)
}
