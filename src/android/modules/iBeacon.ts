import { ManifestConfig } from '../../utils/manifest.config'
import { Results } from '../prepare'
import { appendPermissions } from '../templates/AndroidManifest.xml'
import { defaultAppBuildGradle } from '../templates/app-build.gradle'
import { appendFeature } from '../templates/dcloud_properties.xml'

export function appendIBeacon(results: Results, manifest: ManifestConfig) {
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
