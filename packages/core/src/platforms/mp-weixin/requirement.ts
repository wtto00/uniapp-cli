import { platformName } from './const.js'
import { platformIsInstalled } from './platform-list.js'
import { getWeixinDevToolCliPath } from './utils.js'

export async function requirement(projectInfo: ProjectInfo) {
  const {
    Log,
    utils: { platformNotInstalledMessage, platformInstalledMessage },
  } = projectInfo

  if (!(await platformIsInstalled(projectInfo))) {
    Log.warn(platformNotInstalledMessage(platformName))
  } else {
    Log.success(platformInstalledMessage(platformName))
  }

  if (process.platform !== 'win32' && process.platform !== 'darwin') {
    Log.warn(`微信开发者工具不支持此系统: ${process.platform}`)
    return
  }

  const cliPath = await getWeixinDevToolCliPath(projectInfo)

  if (cliPath) {
    Log.success(`微信开发者工具已安装: ${cliPath}`)
    return
  }

  Log.warn(
    `没有检测到微信开发者工具。如果已经安装，请配置 \`cli${process.platform === 'win32' ? '.bat' : ''}\` 可执行文件的位置`,
  )
}
