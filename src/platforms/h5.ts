import { execa } from 'execa'
import type { GeneratorTransform } from 'execa/types/transform/normalize.js'
import open from 'open'
import { resolveCommand } from 'package-manager-detector/commands'
import type { BuildOptions } from '../build.js'
import type { RunOptions } from '../run.js'
import { App } from '../utils/app.js'
import { stripAnsiColors } from '../utils/exec.js'
import Log from '../utils/log.js'
import { uniRunSuccess } from '../utils/util.js'
import { PlatformModule } from './index.js'

export default class PlatformH5 extends PlatformModule {
  static instance = new PlatformH5()

  modules = ['@dcloudio/uni-h5']

  async run(options: RunOptions) {
    const pm = App.getPackageManager()
    const args: string[] = []
    if (App.isVue3()) {
      args.push('uni')
      if (options.mode) args.push('--mode', options.mode)
    } else {
      args.push('vue-cli-service', 'uni-serve')
    }
    const commands = resolveCommand(pm.agent, 'execute-local', args)
    if (!commands) throw Error(`无法转换执行命令: ${pm.agent} execute-local ${args.join(' ')}`)

    let url = ''
    let over = false

    const stdoutTransform = function* (line: string) {
      yield line
      if (over && url) return

      const text = stripAnsiColors(line)
      if (!url) {
        const matched = text.match(/Local:\s+(http:\/\/localhost:\d+)\//)
        if (matched?.[1]) url = matched[1]
      }
      if (!over && uniRunSuccess(text)) over = true

      if (!over || !url) return

      open(url)
        .then(() => {
          Log.success(`浏览器已打开: ${url}`)
        })
        .catch((error) => {
          Log.error(`浏览器打开失败 ${error.message}`)
        })
    } as GeneratorTransform<false>

    await execa({
      stdout: options.open ? [stdoutTransform, 'inherit'] : 'inherit',
      stderr: 'inherit',
      env: { FORCE_COLOR: 'true' },
      reject: false,
    })`${commands.command} ${commands.args}`
  }

  async build(options: BuildOptions) {
    const pm = App.getPackageManager()
    const args: string[] = []
    if (App.isVue3()) {
      args.push('uni', 'build')
      if (options.mode) args.push('--mode', options.mode)
    } else {
      args.push('vue-cli-service', 'uni-build')
    }
    const commands = resolveCommand(pm.agent, 'execute-local', args)
    if (!commands) throw Error(`无法转换执行命令: ${pm.agent} execute-local ${args.join(' ')}`)

    await execa({ stdio: 'inherit', env: { FORCE_COLOR: 'true' } })`${commands.command} ${commands.args}`
  }
}
