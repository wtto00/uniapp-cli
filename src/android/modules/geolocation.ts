import { AppPlusOS, type ManifestConfig } from '../../utils/manifest.config.js'
import { appendSet } from '../../utils/util.js'
import type { Results } from '../prepare.js'
import { appendMetaData, appendPermissions, appendService } from '../templates/AndroidManifest.xml.js'
import { appendDependencies } from '../templates/app-build.gradle.js'

export function appendGeolocation(results: Results, manifest: ManifestConfig) {
  const Geolocation = manifest['app-plus']?.modules?.Geolocation
  if (!Geolocation) return

  const geolocation = manifest['app-plus']?.distribute?.sdkConfigs?.geolocation

  if (geolocation?.baidu?.__platform__?.includes(AppPlusOS.Android)) {
    appendSet(results.libs, ['baidu-libs-release.aar', 'geolocation-baidu-release.aar'])

    appendMetaData(results.androidManifest, {
      'com.baidu.lbsapi.API_KEY': { value: geolocation.baidu.appkey_android },
    })

    appendService(results.androidManifest, {
      'com.baidu.location.f': {
        properties: {
          'android:enabled': 'true',
          'android:process': ':remote',
        },
      },
    })
  }

  if (geolocation?.amap?.__platform__?.includes(AppPlusOS.Android)) {
    // 3.7.6开始不再提供"amap-libs-release.aar"文件 改为gradle集成！geolocation-amap-release.aar还需要继续添加到项目中
    appendSet(results.libs, ['geolocation-amap-release.aar'])

    appendDependencies(results.appBuildGradle, {
      'com.amap.api:location:6.4.7': {},
    })

    appendPermissions(results.androidManifest, {
      'android.permission.ACCESS_COARSE_LOCATION': {},
      'android.permission.ACCESS_FINE_LOCATION': {},
      'android.permission.ACCESS_WIFI_STATE': {},
      'android.permission.ACCESS_NETWORK_STATE': {},
      'android.permission.CHANGE_WIFI_STATE': {},
      'android.permission.READ_PHONE_STATE': {},
      'android.permission.WRITE_EXTERNAL_STORAGE': {},
      'android.permission.INTERNET': {},
      'android.permission.MOUNT_UNMOUNT_FILESYSTEMS': {},
      'android.permission.READ_LOGS': {},
      'android.permission.WRITE_SETTINGS': {},
      'android.permission.ACCESS_BACKGROUND_LOCATION': {},
      'android.permission.FOREGROUND_SERVICE': {},
    })

    appendMetaData(results.androidManifest, {
      'com.amap.api.v2.apikey': { value: geolocation.amap.appkey_android },
    })

    appendService(results.androidManifest, {
      'com.amap.api.location.APSService': {},
    })
  }

  if (geolocation?.system?.__platform__?.includes(AppPlusOS.Android)) {
    appendPermissions(results.androidManifest, {
      'android.permission.ACCESS_COARSE_LOCATION': {},
      'android.permission.ACCESS_FINE_LOCATION': {},
      'android.permission.ACCESS_WIFI_STATE': {},
      'android.permission.ACCESS_NETWORK_STATE': {},
      'android.permission.CHANGE_WIFI_STATE': {},
      'android.permission.READ_PHONE_STATE': {},
      'android.permission.WRITE_EXTERNAL_STORAGE': {},
      'android.permission.INTERNET': {},
      'android.permission.MOUNT_UNMOUNT_FILESYSTEMS': {},
      'android.permission.READ_LOGS': {},
      'android.permission.WRITE_SETTINGS': {},
    })
  }
}
