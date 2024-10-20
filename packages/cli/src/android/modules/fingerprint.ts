import { ManifestConfig } from '@uniapp-cli/common'
import { Results } from '../prepare'
import { appendPermissions } from '../templates/AndroidManifest.xml'
import { appendFeature } from '../templates/dcloud_properties.xml'

export function appendFaceID(results: Results, manifest: ManifestConfig) {
  const Fingerprint = manifest['app-plus']?.modules?.Fingerprint
  if (!Fingerprint) return

  results.libs.add('fingerprint-release.aar')

  appendPermissions(results.androidManifest, {
    'android.permission.USE_FINGERPRINT': {},
  })

  appendFeature(results.properties, {
    name: 'Fingerprint',
    value: 'io.dcloud.feature.fingerprint.FingerPrintsImpl',
  })
}
