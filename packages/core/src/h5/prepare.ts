import { execa, transformPackageCommand } from '@wtto00/uniapp-common'

export async function prepare(option: { mode?: string }) {
  const args = ['uni', 'build']
  if (option.mode) args.push('--mode', option.mode)
  const commands = await transformPackageCommand('execute-local', args)
  await execa({ stdio: 'inherit', env: { FORCE_COLOR: 'true' } })`${commands.command} ${commands.args}`
}
