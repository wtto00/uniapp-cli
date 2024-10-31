import { existsSync } from 'node:fs'
import { Log } from '../utils/log.js'
import { type ModuleClass, installModules, uninstallModules } from './index.js'
import { isWindows } from '../utils/util.js'
import { execa } from 'execa'
import { resolveCommand } from 'package-manager-detector'
import { App } from '../utils/app.js'
import { stripAnsiColors } from '../utils/exec.js'
import automator from 'miniprogram-automator'
import { resolve } from 'node:path'
import ora from 'ora'

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
  automator
    .launch({
      cliPath,
      projectPath: resolve(App.projectRoot, projectPath),
    })
    .then(() => {
      spinner.succeed('微信开发者工具已打开')
    })
    .catch((error) => {
      spinner.fail(error.message)
    })
}

const mpWeixin: ModuleClass = {
  modules: ['@dcloudio/uni-mp-weixin'],

  async requirement() {
    if (process.platform !== 'win32' && process.platform !== 'darwin') {
      Log.error(`微信开发者平台不支持平台: ${process.platform}`)
      return
    }

    const cliPath = getWeixinDevToolCliPath()

    if (cliPath) {
      Log.success(`${Log.successSignal} 微信开发者工具已安装 (${cliPath})`)
      return
    }

    Log.warn(`${Log.failSignal} 微信开发者工具没有安装`)
    Log.info(
      `  如果已经安装，请设置环境变量 \`WEIXIN_DEV_TOOL\` 为 \`cli${isWindows() ? '.bat' : ''}\` 可执行文件的位置`,
    )
  },

  async platformAdd({ version }) {
    await installModules(mpWeixin.modules, version)
  },

  async platformRemove() {
    await uninstallModules(mpWeixin.modules)
  },

  async run(options) {
    const pm = App.getPackageManager()
    const commands = resolveCommand(pm.agent, 'execute-local', ['uni', '-p', 'mp-weixin'])
    if (!commands) throw Error(`无法转换执行命令: ${pm.agent} execute-local uni -p mp-weixin`)

    try {
      let over = false
      for await (const line of execa({
        stdout: ['inherit', 'pipe'],
        env: { FORCE_COLOR: 'true' },
      })`${commands.command} ${commands.args}`) {
        if (!options.open || over) continue
        const text = stripAnsiColors(line)
        if (/ready in (\d+\.)?\d+m?s\./.test(text)) {
          over = true
          openWeixinDevTool('dist/dev/mp-weixin')
        }
      }
    } catch (error) {
      if ((error as Error).message.match(/CTRL-C/)) return
      throw error
    }
  },

  async build(options) {
    const pm = App.getPackageManager()
    const commands = resolveCommand(pm.agent, 'execute-local', ['uni', 'build', '-p', 'mp-weixin'])
    if (!commands) throw Error(`无法转换执行命令: ${pm.agent} execute-local uni build -p mp-weixin`)

    try {
      const { stdout, stderr } = await execa({
        stdout: ['inherit', 'pipe'],
        env: { FORCE_COLOR: 'true' },
      })`${commands.command} ${commands.args}`
      if (stderr) throw Error(stderr)
      if (!options.open) return

      if (/DONE {2}Build complete\./.test(stdout as string)) {
        openWeixinDevTool('dist/build/mp-weixin')
      }
    } catch (error) {
      if ((error as Error).message.match(/CTRL-C/)) return
      throw error
    }
  },
}

export default mpWeixin
