import { ManifestConfig } from '../../utils/manifest.config'
import { Results } from '../prepare'
import { appendPermissions } from '../templates/AndroidManifest.xml'

export function appendRecord(results: Results, manifest: ManifestConfig) {
  const Record = manifest['app-plus']?.modules?.Record
  if (!Record) return

  appendPermissions(results.androidManifest, {
    'android.permission.RECORD_AUDIO': {},
    'android.permission.MODIFY_AUDIO_SETTINGS': {},
  })
}