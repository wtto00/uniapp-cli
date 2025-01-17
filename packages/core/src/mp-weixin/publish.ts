import { input } from '@inquirer/prompts'
import { App, Log, type PublishOptions, notInstalledMessage } from '@wtto00/uniapp-common'
import { build } from './build.js'
import { platformIsInstalled } from './platform-list.js'
import { buildDistPath } from './utils/const.js'
import { upload } from './utils/utils.js'

export async function publish(options: PublishOptions) {
  if (!(await platformIsInstalled())) {
    throw Error(notInstalledMessage('mp-weixin'))
  }

  let version = options.version
  if (!version) {
    version = (await App.getManifestJson()).versionName
    if (!version) {
      version = await input({ message: '请输入版本号', required: true })
      if (!version) {
        Log.error('版本号不能为空')
        return
      }
    }
    Log.info(`版本号: ${version}`)
  }
  let desc = options.desc
  if (!desc) {
    const today = new Date()
    desc = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日 ${today.getHours()}:${today.getMinutes()} 提交上传`
  }
  Log.info(`备注: ${desc}\n`)

  if (options.build) {
    await build({ open: false, mode: options.mode })
    Log.info()
  }

  await upload(buildDistPath, { version, desc })
}
