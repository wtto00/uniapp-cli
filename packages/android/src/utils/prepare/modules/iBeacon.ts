import { App } from '@wtto00/uniapp-common'
import { appendPermissions } from '../files/AndroidManifest.xml.js'
import { defaultAppBuildGradle } from '../files/app-build.gradle.js'
import { appendFeature } from '../files/dcloud_properties.xml.js'
import type { Results } from '../results.js'

export async function appendIBeacon(results: Results) {
  const manifest = await App.getManifestJson()
  const iBeacon = manifest['app-plus']?.modules?.iBeacon
  if (!iBeacon) return

  results.libs.add('iBeacon-release.aar')

  appendPermissions(results.androidManifest, {
    'android.permission.ACCESS_COARSE_LOCATION': {},
    'android.permission.ACCESS_FINE_LOCATION': {},
    'android.permission.BLUETOOTH_ADMIN': {},
    'android.permission.BLUETOOTH': {},
  })

  const targetSdkVersion =
    manifest['app-plus']?.distribute?.android?.targetSdkVersion ?? defaultAppBuildGradle.targetSdkVersion
  if (targetSdkVersion && targetSdkVersion >= 31) {
    appendPermissions(results.androidManifest, {
      'android.permission.BLUETOOTH_SCAN': {},
      'android.permission.BLUETOOTH_CONNECT': {},
    })
  }

  appendFeature(results.properties, {
    name: 'iBeacon',
    value: 'io.dcloud.feature.iBeacon.WxBluetoothFeatureImpl',
  })
}
