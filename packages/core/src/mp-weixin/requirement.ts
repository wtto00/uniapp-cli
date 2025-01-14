import { Log } from '@wtto00/uniapp-common'
import { platformIsInstalled } from './platform-list.js'
import { getWeixinDevToolCliPath } from './utils/utils.js'

export async function requirement() {
  if (!(await platformIsInstalled())) {
    Log.warn('平台 mp-weixin 还没有安装。请运行 `uniapp platform add mp-weixin` 添加安装')
  } else {
    Log.success('平台 mp-weixin 已安装')
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
