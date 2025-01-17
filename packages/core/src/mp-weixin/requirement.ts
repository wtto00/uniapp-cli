import { Log, installedMessage, notInstalledMessage } from '@wtto00/uniapp-common'
import { PLATFORM } from '../platforms/index.js'
import { platformIsInstalled } from './platform-list.js'
import { getWeixinDevToolCliPath } from './utils/utils.js'

export async function requirement() {
  if (!(await platformIsInstalled())) {
    Log.warn(notInstalledMessage(PLATFORM.MP_WEIXIN))
  } else {
    Log.success(installedMessage(PLATFORM.MP_WEIXIN))
  }

  if (process.platform !== 'win32' && process.platform !== 'darwin') {
    Log.warn(`微信开发者工具不支持此系统: ${process.platform}`)
    return
  }

  const cliPath = await getWeixinDevToolCliPath()

  if (cliPath) {
    Log.success(`微信开发者工具已安装 (${cliPath})`)
    return
  }

  Log.warn(
    `没有检测到微信开发者工具。如果已经安装，请配置 \`cli${process.platform === 'win32' ? '.bat' : ''}\` 可执行文件的位置`,
  )
}
