import { App } from '../../utils/app.js'
import Log from '../../utils/log.js'
import type { AppPlusOS } from '../../utils/manifest.config.js'

export function checkAd(_os: AppPlusOS) {
  const manifest = App.getManifestJson()
  const ad = manifest['app-plus']?.distribute?.sdkConfigs?.ad
  if (!ad) return true

  const errors: string[] = []

  const { config, ...vendor } = ad
  if (!config?.adid) {
    errors.push(
      '您配置了uni-ad广告，请在文件manifest.json中配置uni-ad广告的广告标识-联盟ID: app-plus.distribute.sdkConfigs.ad.config.adid',
    )
  }

  if (Object.keys(vendor).length === 0) {
    errors.push('您配置了uni-ad广告，请在文件manifest.json中至少配置一个广告厂商: app-plus.distribute.sdkConfigs.ad')
  }

  if (ad.gm && ad.pg) {
    errors.push(
      '穿山甲GroMore广告与穿山甲广告互斥，不能同时配置，请在文件manifest.json中修改配置: app-plus.distribute.sdkConfigs.ad.gm, app-plus.distribute.sdkConfigs.ad.pg',
    )
  }
  if (ad.ks && ad['ks-content']) {
    errors.push(
      '快手广告联盟与快手内容联盟互斥，不能同时配置，请在文件manifest.json中修改配置: app-plus.distribute.sdkConfigs.ad.ks, app-plus.distribute.sdkConfigs.ad.ks-content',
    )
  }

  if (!errors.length) return true

  for (const message of errors) {
    Log.warn(message)
  }
  return false
}
