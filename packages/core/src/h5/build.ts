import { type BuildOptions, execa, transformPackageCommand } from '@wtto00/uniapp-common'
import { checkInstalled } from './platform-list.js'

export async function build(options: BuildOptions) {
  await checkInstalled()

  const args = ['uni', 'build']
  if (options.mode) args.push('--mode', options.mode)
  const commands = await transformPackageCommand('execute-local', args)
  await execa({ stdio: 'inherit', env: { FORCE_COLOR: 'true' } })`${commands.command} ${commands.args}`
}
