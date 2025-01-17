import { AppPlusOS, Log, type ManifestConfig } from '@wtto00/uniapp-common'
export function checkGeolocation(manifest: ManifestConfig) {
  const Geolocation = manifest['app-plus']?.modules?.Geolocation
  if (!Geolocation) return true

  const geolocation = manifest['app-plus']?.distribute?.sdkConfigs?.geolocation

  const errors: string[] = []

  if (geolocation?.amap) {
    if (geolocation.amap.__platform__?.includes(AppPlusOS.Android)) {
      if (!geolocation.amap.name) {
        errors.push(
          '您配置了高德定位，请在文件manifest.json中配置高德定位的用户名: app-plus.distribute.sdkConfigs.geolocation.amap.name',
        )
      }
      if (!geolocation.amap.appkey_android) {
        errors.push(
          '您配置了高德定位，请在文件manifest.json中配置高德定位的AppKey: app-plus.distribute.sdkConfigs.geolocation.amap.appkey_android',
        )
      }
    }
  }
  if (geolocation?.baidu) {
    if (geolocation.baidu.__platform__?.includes(AppPlusOS.Android)) {
      if (!geolocation.baidu.appkey_android) {
        errors.push(
          '您配置了百度定位，请在文件manifest.json中配置百度定位的AppKey: app-plus.distribute.sdkConfigs.geolocation.baidu.appkey_android',
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
