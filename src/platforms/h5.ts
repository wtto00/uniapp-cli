import { execa } from 'execa'
import open from 'open'
import ora from 'ora'
import { resolveCommand } from 'package-manager-detector/commands'
import { App } from '../utils/app.js'
import { errorMessage } from '../utils/error.js'
import { stripAnsiColors } from '../utils/exec.js'
import { type ModuleClass, installModules, uninstallModules } from './index.js'

const h5: ModuleClass = {
  modules: ['@dcloudio/uni-h5'],

  requirement() {},

  async platformAdd() {
    const uniVersion = App.getUniVersion()
    await installModules(h5.modules, uniVersion)
  },

  async platformRemove() {
    await uninstallModules(h5.modules)
  },

  async run(options) {
    const pm = App.getPackageManager()
    const args = ['uni']
    if (options.mode) {
      args.push('--mode', options.mode)
    }
    const commands = resolveCommand(pm.agent, 'execute-local', args)
    if (!commands) throw Error(`无法转换执行命令: ${pm.agent} execute-local ${args.join(' ')}`)

    try {
      let url = ''
      let over = false
      for await (const line of execa({
        stderr: ['inherit', 'pipe'],
        stdout: ['inherit', 'pipe'],
        env: { FORCE_COLOR: 'true' },
      })`${commands.command} ${commands.args}`) {
        if (!options.open || over) continue
        const text = stripAnsiColors(line)
        if (!url) {
          const matched = text.match(/Local:\s+(http:\/\/localhost:\d+)\//)
          if (matched?.[1]) url = matched[1]
        }
        if (/ready in (\d+\.)?\d+m?s\./.test(text)) {
          if (!url) continue
          over = true
          const spinner = ora('正在打开浏览器').start()
          open(url)
            .then(() => {
              spinner.succeed(`浏览器已打开: ${url}`)
            })
            .catch((error) => {
              spinner.fail(`浏览器打开失败 ${error.message}`)
            })
        }
      }
    } catch (error) {
      if (errorMessage(error).match(/CTRL-C/)) return
      throw error
    }
  },

  async build(options) {
    const pm = App.getPackageManager()
    const args = ['uni', 'build']
    if (options.mode) {
      args.push('--mode', options.mode)
    }
    const commands = resolveCommand(pm.agent, 'execute-local', args)
    if (!commands) throw Error(`无法转换执行命令: ${pm.agent} execute-local ${args.join(' ')}`)

    try {
      await execa({ stdio: 'inherit', env: { FORCE_COLOR: 'true' } })`${commands.command} ${commands.args}`
    } catch (error) {
      if (errorMessage(error).match(/CTRL-C/)) return
      throw error
    }
  },
}

export default h5
