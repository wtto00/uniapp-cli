import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { execa } from 'execa'
import ora from 'ora'
import { type Command, type DetectResult, detect, resolveCommand } from 'package-manager-detector'
import type { PackageJson } from 'pkg-types'
import { readJsonFile } from './file.js'
import { Log } from './log.js'

declare global {
  var UniAppPackage: PackageJson
  var UniAppPackageManager: DetectResult
  var UniAppVersion: string
}

export async function getPackageJson(): Promise<PackageJson> {
  if (!global.UniAppPackage) {
    global.UniAppPackage = await readJsonFile<PackageJson>('package.json')
  }
  return global.UniAppPackage
}

export async function getPackageManager(options?: { notWarn?: boolean }): Promise<DetectResult> {
  if (!global.UniAppPackageManager) {
    global.UniAppPackageManager = (await detect()) ?? { name: 'npm', agent: 'npm' }
    if (!global.UniAppPackageManager && !options?.notWarn) {
      Log.warn('没有检测到已配置的包管理器，请在 package.json 中配置 packageManager 属性')
    }
  }
  return global.UniAppPackageManager
}

export async function getUniVersion(): Promise<string> {
  if (!global.UniAppVersion) {
    global.UniAppVersion = await getDependencyVersion('@dcloudio/uni-app')
    if (!global.UniAppVersion) throw Error('获取 @dcloudio/uni-app 版本号失败')
  }
  return global.UniAppVersion
}

export async function isInstalled(dependencyName: string): Promise<boolean> {
  const packages = await getPackageJson()
  return !!getPackageDependencies(packages)[dependencyName]
}

export async function getDependencyVersion(dependencyName: string) {
  if (!isInstalled(dependencyName)) return ''
  const modulePackage = resolve(process.cwd(), `node_modules/${dependencyName}/package.json`)
  if (!existsSync(modulePackage)) {
    throw Error(`请先执行命令 \`${(await getPackageManager()).name} install\` 安装依赖！`)
  }
  return (await readJsonFile<PackageJson>(modulePackage)).version ?? ''
}

export async function checkIsUniapp() {
  if (!(await isInstalled('@dcloudio/uni-app'))) {
    throw Error('当前目录不是一个uniapp应用。')
  }
}

export function getPackageDependencies(packageJson: PackageJson) {
  return {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
    ...packageJson.optionalDependencies,
    ...packageJson.peerDependencies,
  }
}

export async function installDependencies(dependencies: string[]) {
  if (dependencies.length === 0) return

  const commands = await transformPackageCommand('add', dependencies)

  const spinner = ora(`正在安装依赖 ${dependencies.join(', ')}`).start()
  const { stderr } = await execa`${commands.command} ${commands.args}`
  if (stderr) {
    spinner.fail(`安装依赖 ${dependencies.join(', ')} 失败了`)
    throw Error
  }
  spinner.succeed(`依赖 ${dependencies.join(', ')} 安装成功`)
}

export async function uninstallDependencies(dependencies: string[]) {
  if (dependencies.length === 0) return

  const commands = await transformPackageCommand('uninstall', dependencies)

  const spinner = ora(`正在卸载依赖 ${dependencies.join(', ')}`).start()
  const { stderr } = await execa`${commands.command} ${commands.args}`
  if (stderr) {
    spinner.fail(`卸载依赖 ${dependencies.join(', ')} 失败了`)
    throw Error
  }
  spinner.succeed(`依赖 ${dependencies.join(', ')} 卸载成功`)
}

export async function transformPackageCommand(command: Command, args: string[]) {
  const pm = await getPackageManager()
  const commands = resolveCommand(pm.agent, command, args)
  if (!commands) throw Error(`无法转换执行命令: ${pm.agent} ${command} ${args.join(' ')}`)
  return commands
}
