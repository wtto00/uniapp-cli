import type { ManifestConfig } from '@uniapp-cli/common'
import type { Results } from '../prepare'
import { appendPermissions } from '../templates/AndroidManifest.xml'
import { defaultAppBuildGradle } from '../templates/app-build.gradle'
import { appendFeature } from '../templates/dcloud_properties.xml'

export function appendBluetooth(results: Results, manifest: ManifestConfig) {
  const Bluetooth = manifest['app-plus']?.modules?.Bluetooth
  if (!Bluetooth) return

  results.libs.add('Bluetooth-release.aar')

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

  appendFeature(results.properties.features, {
    name: 'Bluetooth',
    value: 'io.dcloud.feature.bluetooth.BluetoothFeature',
  })
}
