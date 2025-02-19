import { execa } from 'execa'
import { buildDistPath, platformName } from './const.js'
import { platformIsInstalled } from './platform-list.js'

export async function build(projectInfo: ProjectInfo, options: UniBuildOptions) {
  const {
    Log,
    utils: { platformNotInstalledMessage, transformPackageCommand, stripAnsiColors, uniBuildDone },
  } = projectInfo

  if (!(await platformIsInstalled(projectInfo))) {
    throw Error(platformNotInstalledMessage(platformName))
  }

  const args = ['uni', 'build']
  if (options.mode) args.push('--mode', options.mode)
  const commands = await transformPackageCommand('execute-local', args)
  const { stdout } = await execa({
    stdio: 'inherit',
    env: { FORCE_COLOR: 'true' },
    reject: true,
  })`${commands.command} ${commands.args}`

  const text = stripAnsiColors(stdout as unknown as string)

  if (uniBuildDone(text)) {
    Log.success(`h5 平台已打包完成: ${buildDistPath}`)
  }
}
