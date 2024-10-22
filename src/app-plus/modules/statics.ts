import { AppPlusOS, type ManifestConfig } from '../../utils/manifest.config.js'

export function checkStatistic(manifest: ManifestConfig, os: AppPlusOS) {
  const Statistic = manifest['app-plus']?.modules?.Statistic
  if (!Statistic) return

  const statics = manifest['app-plus']?.distribute?.sdkConfigs?.statics

  if (statics?.umeng) {
    if (
      (os === AppPlusOS.Android && !statics.umeng.appkey_android) ||
      (os === AppPlusOS.iOS && !statics.umeng.appkey_ios)
    ) {
      throw Error(
        `您配置了友盟统计，请在文件manifest.json中配置友盟统计的AppKey: app-plus.distribute.sdkConfigs.statics.umeng.${
          os === AppPlusOS.Android ? 'appkey_android' : 'appkey_ios'
        }`,
      )
    }
    if (
      (os === AppPlusOS.Android && !statics.umeng.channelid_android) ||
      (os === AppPlusOS.iOS && !statics.umeng.channelid_ios)
    ) {
      throw Error(
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
      throw Error(
        `您配置了Google统计，请在文件manifest.json中配置Google统计的配置文件位置: app-plus.distribute.sdkConfigs.statics.google.${
          os === AppPlusOS.Android ? 'config_android' : 'config_ios'
        }`,
      )
    }
  }
}
