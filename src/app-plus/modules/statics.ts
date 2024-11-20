import { App } from '../../utils/app.js'
import Log from '../../utils/log.js'
import { AppPlusOS } from '../../utils/manifest.config.js'

export function checkStatistic(os: AppPlusOS) {
  const manifest = App.getManifestJson()
  const Statistic = manifest['app-plus']?.modules?.Statistic
  if (!Statistic) return true

  const statics = manifest['app-plus']?.distribute?.sdkConfigs?.statics

  const errors: string[] = []

  if (statics?.umeng) {
    if (
      (os === AppPlusOS.Android && !statics.umeng.appkey_android) ||
      (os === AppPlusOS.iOS && !statics.umeng.appkey_ios)
    ) {
      errors.push(
        `您配置了友盟统计，请在文件manifest.json中配置友盟统计的AppKey: app-plus.distribute.sdkConfigs.statics.umeng.${
          os === AppPlusOS.Android ? 'appkey_android' : 'appkey_ios'
        }`,
      )
    }
    if (
      (os === AppPlusOS.Android && !statics.umeng.channelid_android) ||
      (os === AppPlusOS.iOS && !statics.umeng.channelid_ios)
    ) {
      errors.push(
        `您配置了友盟统计，请在文件manifest.json中配置友盟统计的渠道ID: app-plus.distribute.sdkConfigs.statics.umeng.${
          os === AppPlusOS.Android ? 'channelid_android' : 'channelid_ios'
        }`,
      )
    }
  }
  if (statics?.google) {
    if (
      (os === AppPlusOS.Android && !statics.google.config_android) ||
      (os === AppPlusOS.iOS && !statics.google.config_ios)
    ) {
      errors.push(
        `您配置了Google统计，请在文件manifest.json中配置Google统计的配置文件位置: app-plus.distribute.sdkConfigs.statics.google.${
          os === AppPlusOS.Android ? 'config_android' : 'config_ios'
        }`,
      )
    }
  }
  if (!errors.length) return true

  for (const message of errors) {
    Log.warn(message)
  }
  return false
}
