import { input } from '@inquirer/prompts'
import { build } from './build.js'
import { buildDistPath, platformName } from './const.js'
import { platformIsInstalled } from './platform-list.js'
import { upload } from './utils.js'

export async function publish(projectInfo: ProjectInfo, options: UniPublishOptions) {
  const {
    utils: { platformNotInstalledMessage },
    manifest,
    Log,
  } = projectInfo

  if (!(await platformIsInstalled(projectInfo))) {
    throw Error(platformNotInstalledMessage(platformName))
  }

  let version = options.version
  if (!version) {
    version = manifest.versionName
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
    await build(projectInfo, { open: false, mode: options.mode })
    Log.info()
  }

  await upload(projectInfo, buildDistPath, { version, desc })
}
