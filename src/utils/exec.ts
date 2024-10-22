import {
  type ChildProcess,
  type SpawnOptionsWithStdioTuple,
  type SpawnSyncOptionsWithStringEncoding,
  type SpawnSyncReturns,
  type StdioNull,
  type StdioPipe,
  spawn,
  spawnSync,
} from 'node:child_process'
import { Log } from './log.js'
import { detectPackageManager, isNPM } from './package.js'
import ora from 'ora'

export function spawnExecSync(
  cmd: string,
  args: string[] = [],
  option?: Omit<SpawnSyncOptionsWithStringEncoding, 'encoding'>,
) {
  return spawnSync(`"${cmd}"`, args, { encoding: 'utf8', shell: true, ...option })
}

export function spawnExec(
  cmd: string,
  args: string[],
  callback: (log: string) => void,
  option?: Omit<SpawnOptionsWithStdioTuple<StdioNull, StdioPipe, StdioPipe>, 'stdio'>,
) {
  const proc = spawn(`"${cmd}"`, args, { stdio: ['inherit', 'pipe', 'pipe'], shell: true, ...option })

  proc.stdout.pipe(process.stdout)
  proc.stdout.setEncoding('utf8')
  proc.stdout.on('data', callback)
  proc.stderr.pipe(process.stdout)
  proc.stderr.setEncoding('utf8')
  proc.stderr.on('data', Log.error)

  return proc
}

export function killChildProcess(proc: ChildProcess) {
  proc.stdout?.destroy()
  proc.stderr?.destroy()
  proc.kill('SIGKILL')
}

/**
 * Get output string from spawnSync
 * @param proc child_process
 * @returns
 */
export function getOutput(proc: SpawnSyncReturns<string>) {
  return proc.output.reverse().reduce((prev, curr) => prev + (curr ?? ''), '') ?? ''
}

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
export function isVueCliInstalled() {
  return getOutput(spawnExecSync('vue')).includes('Usage: vue')
}

export function installVueCli() {
  Log.info('@vue/cli not installed, starting global installation of @vue/cli.')
  spawnExecSync('npm', ['i', '-g', '@vue/cli'], { stdio: 'inherit' })
  if (isVueCliInstalled()) {
    Log.info('@vue/cli has been successfully installed.')
  } else {
    Log.warn('@vue/cli installation failed. Please manually execute npm i -g @vue/cli.')
    process.exit()
  }
}

export function createVueProject(appName: string, template: string, force = false) {
  spawnExecSync('vue', ['create', '-p', template, appName, force ? '--force' : ''], { stdio: 'inherit' })
}

export function installPackages(packages: string[]) {
  const pm = detectPackageManager()
  const spinner = ora(`正在安装依赖 ${packages.join(', ')}`).start()
  try {
    spawnExecSync('node', [pm, isNPM(pm) ? 'install' : 'add', ...packages])
    spinner.succeed(`依赖 ${packages.join(', ')} 安装成功。`)
  } catch (error) {
    spinner.fail(`依赖 ${packages.join(', ')} 安装失败。`)
    throw error
  }
}

export function uninstallPackages(packages: string[]) {
  const pm = detectPackageManager()
  const spinner = ora(`正在卸载依赖 ${packages.join(', ')}`).start()
  try {
    spawnExecSync('node', [pm, isNPM(pm) ? 'uninstall' : 'remove', ...packages])
    spinner.succeed(`依赖 ${packages.join(', ')} 卸载成功。`)
  } catch (error) {
    spinner.fail(`依赖 ${packages.join(', ')} 卸载失败。`)
    throw error
  }
}
