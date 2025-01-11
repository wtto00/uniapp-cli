import { App } from '../../utils/app.js'
import type { Results } from '../prepare.js'
import { appendPermissions } from '../templates/AndroidManifest.xml.js'
import { appendFeature } from '../templates/dcloud_properties.xml.js'

export function appendFingerprint(results: Results) {
  const manifest = App.getManifestJson()
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
