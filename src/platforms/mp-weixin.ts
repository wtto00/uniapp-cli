import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { execa } from 'execa'
import type { GeneratorTransform } from 'execa/types/transform/normalize.js'
import ora from 'ora'
import { resolveCommand } from 'package-manager-detector/commands'
import type { BuildOptions } from '../build.js'
import type { RunOptions } from '../run.js'
import { App } from '../utils/app.js'
import { stripAnsiColors } from '../utils/exec.js'
import Log from '../utils/log.js'
import { isWindows, uniRunSuccess } from '../utils/util.js'
import { PlatformModule } from './index.js'

function getWeixinDevToolCliPath() {
  if (process.env.WEIXIN_DEV_TOOL) {
    if (existsSync(process.env.WEIXIN_DEV_TOOL)) return process.env.WEIXIN_DEV_TOOL
  }
  const defaultPath = isWindows()
    ? 'C:\\Program Files (x86)\\Tencent\\微信web开发者工具\\cli.bat'
    : '/Applications/wechatwebdevtools.app/Contents/MacOS/cli'
  if (existsSync(defaultPath)) return defaultPath
}

function openWeixinDevTool(projectPath: string) {
  const cliPath = getWeixinDevToolCliPath()
  if (!cliPath) {
    Log.error('微信开发工具没有找到，请运行 `uniapp requirement mp-weixin` 查看详细信息')
    return
  }
  const spinner = ora('正在打开微信开发者工具').start()
  execa`${cliPath} ${['open', '--project', resolve(App.projectRoot, projectPath)]}`
    .then(({ stderr }) => {
      if (stderr) {
        spinner.fail('微信开发者工具打开出错了')
      } else {
        spinner.succeed('微信开发者工具已打开')
      }
    })
    .catch((_err) => {
      spinner.fail('微信开发者工具打开出错了')
    })
}

export class PlatformMPWeixin extends PlatformModule {
  modules = ['@dcloudio/uni-mp-weixin']

  async requirement() {
    if (process.platform !== 'win32' && process.platform !== 'darwin') {
      Log.error(`微信开发者工具不支持系统: ${process.platform}`)
      return
    }

    const cliPath = getWeixinDevToolCliPath()

    if (cliPath) {
      Log.success(`微信开发者工具已安装 (${cliPath})`)
      return
    }

    Log.warn(
      `没有检测到微信开发者工具。如果已经安装，请设置环境变量 \`WEIXIN_DEV_TOOL\` 为 \`cli${isWindows() ? '.bat' : ''}\` 可执行文件的位置`,
    )
  }

  async run(options: RunOptions) {
    const pm = App.getPackageManager()
    const args = []
    if (App.isVue3()) {
      args.push('uni', '-p', 'mp-weixin')
      if (options.mode) args.push('--mode', options.mode)
    } else {
      args.push('vue-cli-service', 'uni-build', '--watch')
    }
    const commands = resolveCommand(pm.agent, 'execute-local', args)
    if (!commands) throw Error(`无法转换执行命令: ${pm.agent} execute-local ${args.join(' ')}`)

    let over = false

    const stdoutTransform = function* (line: string) {
      yield line
      if (over) return

      const text = stripAnsiColors(line)
      if (!uniRunSuccess(text)) return

      over = true
      openWeixinDevTool('dist/dev/mp-weixin')
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
      args.push('uni', 'build', '-p', 'mp-weixin')
      if (options.mode) args.push('--mode', options.mode)
    } else {
      args.push('vue-cli-service', 'uni-build')
    }
    const commands = resolveCommand(pm.agent, 'execute-local', args)
    if (!commands) throw Error(`无法转换执行命令: ${pm.agent} execute-local ${args.join(' ')}`)

    const { stdout } = await execa({
      stdout: ['inherit', 'pipe'],
      stderr: 'inherit',
      env: { FORCE_COLOR: 'true' },
    })`${commands.command} ${commands.args}`
    if (!options.open) return

    const text = stripAnsiColors(stdout as unknown as string)
    if (/DONE {2}Build complete\./.test(text)) {
      openWeixinDevTool('dist/build/mp-weixin')
    }
  }
}
