import { execa } from 'execa'
import ora from 'ora'
import { detect, resolveCommand } from 'package-manager-detector'
import { Log } from './log.js'

/**
 * Remove the color of the output text
 * @param text output text
 */
export function outputRemoveColor(text: string) {
  // biome-ignore lint/suspicious/noControlCharactersInRegex: <explanation>
  return text.replace(/\x1B\[\d+m/g, '')
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
  const pm = await detect()
  if (!pm) throw new Error('没有检测到包管理器。')
  const { command, args = [] } = resolveCommand(pm.agent, 'add', packages) ?? {}
  if (!command || args.length === 0) throw Error(`无法转换执行命令: ${pm.agent} add ${packages.join(' ')}`)

  const spinner = ora(`正在安装依赖 ${packages.join(', ')}`).start()
  const { stderr } = await execa`${command} ${args}`
  if (stderr) {
    spinner.fail(`安装依赖 ${packages.join(', ')} 失败了。`)
    throw Error
  }
  spinner.succeed(`依赖 ${packages.join(', ')} 安装成功。`)
}

export async function uninstallPackages(packages: string[]) {
  const pm = await detect()
  if (!pm) throw new Error('没有检测到包管理器。')
  const { command, args = [] } = resolveCommand(pm.agent, 'uninstall', packages) ?? {}
  if (!command || args.length === 0) throw Error(`无法转换执行命令: ${pm.agent} uninstall ${packages.join(' ')}`)

  const spinner = ora(`正在卸载依赖 ${packages.join(', ')}`).start()
  const { stderr } = await execa`${command} ${args}`
  if (stderr) {
    spinner.fail(`卸载依赖 ${packages.join(', ')} 失败了。`)
    throw Error
  }
  spinner.succeed(`依赖 ${packages.join(', ')} 卸载成功。`)
}
