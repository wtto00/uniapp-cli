import { Log, execa, stripAnsiColors, transformPackageCommand } from '@wtto00/uniapp-common'
import { checkInstalled } from './platform-list.js'
import { buildDistPath } from './utils/const.js'
import { openWeixinDevTool } from './utils/utils.js'

export async function build(options: { open?: boolean; mode?: string }) {
  await checkInstalled()

  const args = ['uni', 'build', '-p', 'mp-weixin']
  if (options.mode) args.push('--mode', options.mode)
  const commands = await transformPackageCommand('execute-local', args)

  Log.info('开始打包微信小程序...')
  const { stdout } = await execa({
    stdout: ['inherit', 'pipe'],
    stderr: 'inherit',
    env: { FORCE_COLOR: 'true' },
  })`${commands.command} ${commands.args}`
  if (!options.open) return

  const text = stripAnsiColors(stdout as unknown as string)

  if (/DONE {2}Build complete\./.test(text)) {
    await openWeixinDevTool(buildDistPath)
  }
}
