import { execa } from 'execa'
import { buildDistPath, platformName } from './const.js'
import { platformIsInstalled } from './platform-list.js'
import { openWeixinDevTool } from './utils.js'

export async function build(projectInfo: ProjectInfo, options: { open?: boolean; mode?: string }) {
  const {
    utils: { platformNotInstalledMessage, transformPackageCommand, stripAnsiColors, uniBuildDone },
    Log,
  } = projectInfo

  if (!(await platformIsInstalled(projectInfo))) {
    throw Error(platformNotInstalledMessage(platformName))
  }

  const args = ['uni', 'build', '-p', platformName]
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

  if (uniBuildDone(text)) {
    await openWeixinDevTool(projectInfo, buildDistPath)

    Log.success(
      `${platformName} 平台已打包完成。可以在开发者工具中点击上传发布，或者使用 \`uniapp publish ${platformName}\` 来发布`,
    )
  }
}
