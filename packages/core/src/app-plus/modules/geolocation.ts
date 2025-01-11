import { App } from '../../utils/app.js'
import Log from '../../utils/log.js'
import { AppPlusOS } from '../../utils/manifest.config.js'

export function checkGeolocation(os: AppPlusOS) {
  const manifest = App.getManifestJson()
  const Geolocation = manifest['app-plus']?.modules?.Geolocation
  if (!Geolocation) return true

  const geolocation = manifest['app-plus']?.distribute?.sdkConfigs?.geolocation

  const errors: string[] = []

  if (geolocation?.amap) {
    if (geolocation.amap.__platform__?.includes(os)) {
      if (!geolocation.amap.name) {
        errors.push(
          '您配置了高德定位，请在文件manifest.json中配置高德定位的用户名: app-plus.distribute.sdkConfigs.geolocation.amap.name',
        )
      }
      if (
        (os === AppPlusOS.Android && !geolocation.amap.appkey_android) ||
        (os === AppPlusOS.iOS && !geolocation.amap.appkey_ios)
      ) {
        errors.push(
          `您配置了高德定位，请在文件manifest.json中配置高德定位的AppKey: app-plus.distribute.sdkConfigs.geolocation.amap.${
            os === AppPlusOS.Android ? 'appkey_android' : 'appkey_ios'
          }`,
        )
      }
    }
  }
  if (geolocation?.baidu) {
    if (geolocation.baidu.__platform__?.includes(os)) {
      if (
        (os === AppPlusOS.Android && !geolocation.baidu.appkey_android) ||
        (os === AppPlusOS.iOS && !geolocation.baidu.appkey_ios)
      ) {
        errors.push(
          `您配置了百度定位，请在文件manifest.json中配置百度定位的AppKey: app-plus.distribute.sdkConfigs.geolocation.baidu.${
            os === AppPlusOS.Android ? 'appkey_android' : 'appkey_ios'
          }`,
        )
      }
    }
  }

  if (!errors.length) return true

  for (const message of errors) {
    Log.warn(message)
  }
  return false
}
