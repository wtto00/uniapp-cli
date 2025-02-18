import { App } from '@wtto00/uniapp-common'
import { appendPermissions } from '../files/AndroidManifest.xml.js'
import { appendFeature } from '../files/dcloud_properties.xml.js'
import type { Results } from '../results.js'

export async function appendFingerprint(results: Results) {
  const manifest = await App.getManifestJson()

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
