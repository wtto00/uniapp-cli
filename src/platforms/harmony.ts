import { cp, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { execa } from 'execa'
import type { GeneratorTransform } from 'execa/types/transform/normalize.js'
import { resolveCommand } from 'package-manager-detector'
import type { BuildOptions } from '../build.js'
import { buildHarmony } from '../harmony/build.js'
import { checkConfig } from '../harmony/check.js'
import type { RunOptions } from '../run.js'
import { App } from '../utils/app.js'
import { stripAnsiColors } from '../utils/exec.js'
import { exists } from '../utils/file.js'
import Log from '../utils/log.js'
import { uninstallDeps } from '../utils/package.js'
import { HarmonyDir, HarmonyPath, TemplateDir } from '../utils/path.js'
import { showSpinner } from '../utils/spinner.js'
import { uniRunSuccess } from '../utils/util.js'
import PlatformAndroid from './android.js'
import { PlatformModule } from './index.js'
import PlatformIOS from './ios.js'

export default class PlatformHarmony extends PlatformModule {
  static instance = new PlatformHarmony()

  modules = ['@dcloudio/uni-app-harmony', '@dcloudio/uni-uts-v1']

  async isInstalled() {
    return (await super.isInstalled()) && (await exists(HarmonyDir))
  }

  async requirement() {
    // HARMONY_HOME
    if (process.env.HARMONY_HOME) {
      Log.success(`HARMONY_HOME=${process.env.HARMONY_HOME}`)
    } else {
      Log.warn('没有设置环境变量: `HARMONY_HOME`')
    }
  }

  async add() {
    await super.add()

    try {
      await cp(join(TemplateDir, 'harmony'), HarmonyDir, { recursive: true })
    } catch (error) {
      await rm(HarmonyDir, { recursive: true, force: true })
      throw error
    }
  }

  async remove() {
    if (!(await PlatformAndroid.instance.isInstalled()) && !(await PlatformIOS.instance.isInstalled())) {
      await uninstallDeps(this.modules)
    } else {
      await uninstallDeps(this.modules.slice(0, 1))
    }
    await showSpinner(() => rm(HarmonyDir, { recursive: true, force: true }), {
      start: `正在删除 ${HarmonyPath}`,
      succeed: `${HarmonyPath} 已删除`,
      fail: `${HarmonyPath} 删除失败`,
    })
  }

  async run(options: RunOptions) {
    checkConfig()

    const pm = App.getPackageManager()
    const args = []
    args.push('uni', '-p', 'app-harmony')
    if (options.mode) args.push('--mode', options.mode)

    const commands = resolveCommand(pm.agent, 'execute-local', args)
    if (!commands) throw Error(`无法转换执行命令: ${pm.agent} execute-local ${args.join(' ')}`)

    let over = false
    const outTransform = function* (line: string) {
      yield line
      if (over) return
      const text = stripAnsiColors(line)
      if (uniRunSuccess(text)) {
        over = true
        buildHarmony(options)
      }
    } as GeneratorTransform<false>
    const errTransform = function* (line: string) {
      const text = stripAnsiColors(line)
      if (
        text === 'Cannot find module: @dcloudio/uni-uts-v1' ||
        text.includes('应用使用了uts插件，正在安装 uts Harmony 运行扩展...')
      ) {
        Log.error('应用使用了UTS插件，请添加 `--hxcli [cliPath]` 参数以使用HBuilderX运行')
        process.exit(1)
      }
      if (text !== 'HBuilderX is not found') yield line
    } as GeneratorTransform<false>
    await execa({
      stdout: options.open ? [outTransform, 'inherit'] : 'inherit',
      stderr: [errTransform, 'inherit'],
      env: { FORCE_COLOR: 'true' },
      reject: false,
    })`${commands.command} ${commands.args}`
  }

  async build(_options: BuildOptions) {
    return Promise.reject(Error('暂未实现'))
  }
}
