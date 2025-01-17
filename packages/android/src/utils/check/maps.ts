import { Log, type ManifestConfig } from '@wtto00/uniapp-common'

export function checkMaps(manifest: ManifestConfig) {
  const Maps = manifest['app-plus']?.modules?.Maps
  if (!Maps) return true

  const maps = manifest['app-plus']?.distribute?.sdkConfigs?.maps

  const errors: string[] = []

  if (maps?.amap) {
    if (!maps.amap.name) {
      errors.push(
        '您配置了高德地图，请在文件manifest.json中配置高德地图的用户名: app-plus.distribute.sdkConfigs.maps.amap.name',
      )
    }
    if (!maps.amap.appkey_android) {
      errors.push(
        '您配置了高德地图，请在文件manifest.json中配置高德地图的AppKey: app-plus.distribute.sdkConfigs.maps.amap.appkey_android',
      )
    }
  }
  if (maps?.baidu) {
    if (!maps.baidu.appkey_android) {
      errors.push(
        '您配置了百度地图，请在文件manifest.json中配置百度地图的AppKey: app-plus.distribute.sdkConfigs.maps.baidu.appkey_android',
      )
    }
  }
  if (maps?.google) {
    if (!maps.google.APIKey_android) {
      errors.push(
        '您配置了Google地图，请在文件manifest.json中配置Google地图的APIKey: app-plus.distribute.sdkConfigs.maps.google.APIKey_android',
      )
    }
  }

  // 高德地图和百度地图的配置只能保留一个
  if (maps?.amap && maps.baidu) {
    errors.push(
      '您不能同时配置高德地图和百度地图，请在文件manifest.json中修改配置: app-plus.distribute.sdkConfigs.maps.amap, app-plus.distribute.sdkConfigs.maps.baidu',
    )
  }

  if (!errors.length) return true

  for (const message of errors) {
    Log.warn(message)
  }
  return false
}
