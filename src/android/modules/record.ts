import type { ManifestConfig } from '../../utils/manifest.config.js'
import type { Results } from '../prepare.js'
import { appendPermissions } from '../templates/AndroidManifest.xml.js'

export function appendRecord(results: Results, manifest: ManifestConfig) {
  const Record = manifest['app-plus']?.modules?.Record
  if (!Record) return

  appendPermissions(results.androidManifest, {
    'android.permission.RECORD_AUDIO': {},
    'android.permission.MODIFY_AUDIO_SETTINGS': {},
  })
}
