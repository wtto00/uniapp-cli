import type { AppPlusOS, ManifestConfig } from '../../utils/manifest.config.js'

export function checkAd(manifest: ManifestConfig, _os: AppPlusOS) {
  const ad = manifest['app-plus']?.distribute?.sdkConfigs?.ad
  if (!ad) return

  const { config, ...vendor } = ad
  if (!config?.adid) {
    throw Error(
      '您配置了uni-ad广告，请在文件manifest.json中配置uni-ad广告的广告标识-联盟ID: app-plus.distribute.sdkConfigs.ad.config.adid',
    )
  }

  if (Object.keys(vendor).length === 0) {
    throw Error('您配置了uni-ad广告，请在文件manifest.json中至少配置一个广告厂商: app-plus.distribute.sdkConfigs.ad')
  }

  if (ad.gm && ad.pg) {
    throw Error(
      '穿山甲GroMore广告与穿山甲广告互斥，不能同时配置，请在文件manifest.json中修改配置: app-plus.distribute.sdkConfigs.ad.gm, app-plus.distribute.sdkConfigs.ad.pg',
    )
  }
  if (ad.ks && ad['ks-content']) {
    throw Error(
      '快手广告联盟与快手内容联盟互斥，不能同时配置，请在文件manifest.json中修改配置: app-plus.distribute.sdkConfigs.ad.ks, app-plus.distribute.sdkConfigs.ad.ks-content',
    )
  }
}
