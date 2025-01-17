import {
  type StdoutStderrOption,
  execa,
  notInstalledMessage,
  stripAnsiColors,
  transformPackageCommand,
  uniRunSuccess,
} from '@wtto00/uniapp-common'
import { platformIsInstalled } from './platform-list.js'
import { openWeixinDevTool } from './utils/utils.js'

export async function run(options: { open: boolean; mode?: string }) {
  if (!(await platformIsInstalled())) {
    throw Error(notInstalledMessage('mp-weixin'))
  }

  const args = ['uni', '-p', 'mp-weixin']
  if (options.mode) args.push('--mode', options.mode)
  const commands = await transformPackageCommand('execute-local', args)

  let over = false

  const stdoutTransform = function* (line: string) {
    yield line
    if (over) return

    const text = stripAnsiColors(line)
    if (!uniRunSuccess(text)) return

    over = true
    void openWeixinDevTool('dist/dev/mp-weixin')
  }

  await execa({
    stdout: options.open ? ([stdoutTransform, 'inherit'] as StdoutStderrOption) : 'inherit',
    stderr: 'inherit',
    env: { FORCE_COLOR: 'true' },
    reject: false,
  })`${commands.command} ${commands.args}`
}
