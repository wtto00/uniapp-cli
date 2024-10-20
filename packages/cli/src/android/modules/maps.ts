import { ManifestConfig } from '@uniapp-cli/common'
import { Results } from '../prepare'
import { appendSet } from '../../utils/util'
import { appendMetaData, appendPermissions, appendService } from '../templates/AndroidManifest.xml'
import { appendFeature } from '../templates/dcloud_properties.xml'
import { appendDependencies } from '../templates/app-build.gradle'

export function appendMaps(results: Results, manifest: ManifestConfig) {
  const Maps = manifest['app-plus']?.modules?.Maps
  if (!Maps) return

  const maps = manifest['app-plus']?.distribute?.sdkConfigs?.maps

  if (maps?.baidu) {
    appendSet(results.libs, ['baidu-libs-release.aar', 'map-baidu-release.aar'])

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

    appendMetaData(results.androidManifest, {
      'com.baidu.lbsapi.API_KEY': { value: maps.baidu.appkey_android },
    })
    appendService(results.androidManifest, {
      'com.baidu.location.f': {
        properties: {
          'android:enabled': 'true',
          'android:process': ':remote',
        },
      },
    })

    appendFeature(results.properties, {
      name: 'Maps',
      value: 'io.dcloud.js.map.JsMapPluginImpl',
    })
    results.properties.services.Maps = 'io.dcloud.js.map.MapInitImpl'
  }

  if (maps?.amap) {
    results.libs.add(maps.amap.nvue ? 'weex_amap-release.aar' : 'map-amap-release.aar')

    appendDependencies(results.appBuildGradle, {
      'com.amap.api:3dmap:9.5.0': {},
      'com.amap.api:search:9.4.5': {},
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
    })

    appendMetaData(results.androidManifest, {
      'com.amap.api.v2.apikey': { value: maps.amap.appkey_android },
    })
    appendService(results.androidManifest, {
      'com.amap.api.location.APSService': {},
    })
    appendFeature(results.properties, {
      name: 'Maps',
      value: 'io.dcloud.js.map.amap.JsMapPluginImpl',
    })
  }

  if (maps?.google) {
    results.libs.add('weex_google-map-release.aar')

    appendDependencies(results.appBuildGradle, {
      'com.google.android.gms:play-services-maps:18.0.1': {},
    })

    appendPermissions(results.androidManifest, {
      'android.permission.ACCESS_COARSE_LOCATION': {},
      'android.permission.ACCESS_FINE_LOCATION': {},
      'android.permission.ACCESS_NETWORK_STATE': {},
      'android.permission.INTERNET': {},
      'android.permission.WRITE_EXTERNAL_STORAGE': {},
      'android.permission.ACCESS_LOCATION_EXTRA_COMMANDS': {},
    })

    appendMetaData(results.androidManifest, {
      'com.google.android.geo.API_KEY': { value: maps.google.APIKey_android },
    })
  }
}
