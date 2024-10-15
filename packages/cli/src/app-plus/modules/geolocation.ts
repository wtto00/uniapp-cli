import { AppPlusOS, ManifestConfig } from '@uniapp-cli/common'

export function checkGeolocation(manifest: ManifestConfig, os: AppPlusOS) {
  const Geolocation = manifest['app-plus']?.modules?.Geolocation
  if (!Geolocation) return

  const geolocation = manifest['app-plus']?.distribute?.sdkConfigs?.geolocation

  if (geolocation?.amap) {
    if (geolocation.amap.__platform__?.includes(os)) {
      if (!geolocation.amap.name) {
        throw Error(
          '您配置了高德定位，请在文件manifest.json中配置高德定位的用户名: app-plus.distribute.sdkConfigs.geolocation.amap.name',
        )
      }
      if (
        (os == AppPlusOS.Android && !geolocation.amap.appkey_android) ||
        (os == AppPlusOS.iOS && !geolocation.amap.appkey_ios)
      ) {
        throw Error(
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
        (os == AppPlusOS.Android && !geolocation.baidu.appkey_android) ||
        (os == AppPlusOS.iOS && !geolocation.baidu.appkey_ios)
      ) {
        throw Error(
          `您配置了百度定位，请在文件manifest.json中配置百度定位的AppKey: app-plus.distribute.sdkConfigs.geolocation.baidu.${
            os === AppPlusOS.Android ? 'appkey_android' : 'appkey_ios'
          }`,
        )
      }
    }
  }
}
