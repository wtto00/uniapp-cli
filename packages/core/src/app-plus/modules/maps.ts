import { App } from '../../utils/app.js'
import Log from '../../utils/log.js'
import { AppPlusOS } from '../../utils/manifest.config.js'

export function checkMaps(os: AppPlusOS) {
  const manifest = App.getManifestJson()
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
    if ((os === AppPlusOS.Android && !maps.amap.appkey_android) || (os === AppPlusOS.iOS && !maps.amap.appkey_ios)) {
      errors.push(
        `您配置了高德地图，请在文件manifest.json中配置高德地图的AppKey: app-plus.distribute.sdkConfigs.maps.amap.${
          os === AppPlusOS.Android ? 'appkey_android' : 'appkey_ios'
        }`,
      )
    }
  }
  if (maps?.baidu) {
    if ((os === AppPlusOS.Android && !maps.baidu.appkey_android) || (os === AppPlusOS.iOS && !maps.baidu.appkey_ios)) {
      errors.push(
        `您配置了百度地图，请在文件manifest.json中配置百度地图的AppKey: app-plus.distribute.sdkConfigs.maps.baidu.${
          os === AppPlusOS.Android ? 'appkey_android' : 'appkey_ios'
        }`,
      )
    }
  }
  if (maps?.google) {
    if (
      (os === AppPlusOS.Android && !maps.google.APIKey_android) ||
      (os === AppPlusOS.iOS && !maps.google.APIKey_ios)
    ) {
      errors.push(
        `您配置了Google地图，请在文件manifest.json中配置Google地图的APIKey: app-plus.distribute.sdkConfigs.maps.google.${
          os === AppPlusOS.Android ? 'APIKey_android' : 'APIKey_ios'
        }`,
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
