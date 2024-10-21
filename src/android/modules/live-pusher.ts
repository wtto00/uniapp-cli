import { ManifestConfig } from '../../utils/manifest.config'
import { Results } from '../prepare'
import { appendPermissions } from '../templates/AndroidManifest.xml'
import { appendFeature } from '../templates/dcloud_properties.xml'

export function appendLivePusher(results: Results, manifest: ManifestConfig) {
  const LivePusher = manifest['app-plus']?.modules?.LivePusher
  if (!LivePusher) return

  results.libs.add('weex_livepusher-release.aar')

  appendPermissions(results.androidManifest, {
    'android.permission.INTERNET': {},
    'android.permission.ACCESS_NETWORK_STATE': {},
    'android.permission.ACCESS_WIFI_STATE': {},
    'android.permission.WRITE_EXTERNAL_STORAGE': {},
    'android.permission.READ_EXTERNAL_STORAGE': {},
    'android.permission.RECORD_AUDIO': {},
    'android.permission.MODIFY_AUDIO_SETTINGS': {},
    'android.permission.BLUETOOTH': {},
    'android.permission.CAMERA': {},
    'android.permission.READ_PHONE_STATE': {},
    'android.hardware.Camera': {},
    'android.hardware.camera.autofocus': {},
  })

  appendFeature(results.properties, {
    name: 'LivePusher',
    value: 'io.dcloud.media.live.LiveMediaFeatureImpl',
  })
}
