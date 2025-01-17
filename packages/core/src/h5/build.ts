import { type BuildOptions, execa, notInstalledMessage, transformPackageCommand } from '@wtto00/uniapp-common'
import { platformIsInstalled } from './platform-list.js'

export async function build(options: BuildOptions) {
  if (!(await platformIsInstalled())) {
    throw Error(notInstalledMessage('h5'))
  }

  const args = ['uni', 'build']
  if (options.mode) args.push('--mode', options.mode)
  const commands = await transformPackageCommand('execute-local', args)
  await execa({ stdio: 'inherit', env: { FORCE_COLOR: 'true' } })`${commands.command} ${commands.args}`
}
