import { AppPlusOS, ManifestConfig } from '@uniapp-cli/common'

export function checkMaps(manifest: ManifestConfig, os: AppPlusOS) {
  const Maps = manifest['app-plus']?.modules?.Maps
  if (!Maps) return

  const maps = manifest['app-plus']?.distribute?.sdkConfigs?.maps

  if (maps?.amap) {
    if (!maps.amap.name) {
      throw Error(
        '您配置了高德地图，请在文件manifest.json中配置高德地图的用户名: app-plus.distribute.sdkConfigs.maps.amap.name',
      )
    }
    if ((os == AppPlusOS.Android && !maps.amap.appkey_android) || (os == AppPlusOS.iOS && !maps.amap.appkey_ios)) {
      throw Error(
        `您配置了高德地图，请在文件manifest.json中配置高德地图的AppKey: app-plus.distribute.sdkConfigs.maps.amap.${
          os === AppPlusOS.Android ? 'appkey_android' : 'appkey_ios'
        }`,
      )
    }
  }
  if (maps?.baidu) {
    if ((os == AppPlusOS.Android && !maps.baidu.appkey_android) || (os == AppPlusOS.iOS && !maps.baidu.appkey_ios)) {
      throw Error(
        `您配置了百度地图，请在文件manifest.json中配置百度地图的AppKey: app-plus.distribute.sdkConfigs.maps.baidu.${
          os === AppPlusOS.Android ? 'appkey_android' : 'appkey_ios'
        }`,
      )
    }
  }
  if (maps?.google) {
    if ((os == AppPlusOS.Android && !maps.google.APIKey_android) || (os == AppPlusOS.iOS && !maps.google.APIKey_ios)) {
      throw Error(
        `您配置了Google地图，请在文件manifest.json中配置Google地图的APIKey: app-plus.distribute.sdkConfigs.maps.google.${
          os === AppPlusOS.Android ? 'APIKey_android' : 'APIKey_ios'
        }`,
      )
    }
  }
}
