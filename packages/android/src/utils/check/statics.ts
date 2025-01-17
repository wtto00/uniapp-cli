import { Log, type ManifestConfig } from '@wtto00/uniapp-common'

export function checkStatistic(manifest: ManifestConfig) {
  const Statistic = manifest['app-plus']?.modules?.Statistic
  if (!Statistic) return true

  const statics = manifest['app-plus']?.distribute?.sdkConfigs?.statics

  const errors: string[] = []

  if (statics?.umeng) {
    if (!statics.umeng.appkey_android) {
      errors.push(
        '您配置了友盟统计，请在文件manifest.json中配置友盟统计的AppKey: app-plus.distribute.sdkConfigs.statics.umeng.appkey_android',
      )
    }
    if (!statics.umeng.channelid_android) {
      errors.push(
        '您配置了友盟统计，请在文件manifest.json中配置友盟统计的渠道ID: app-plus.distribute.sdkConfigs.statics.umeng.channelid_android',
      )
    }
  }
  if (statics?.google) {
    if (!statics.google.config_android) {
      errors.push(
        '您配置了Google统计，请在文件manifest.json中配置Google统计的配置文件位置: app-plus.distribute.sdkConfigs.statics.google.config_android',
      )
    }
  }
  if (!errors.length) return true

  for (const message of errors) {
    Log.warn(message)
  }
  return false
}
