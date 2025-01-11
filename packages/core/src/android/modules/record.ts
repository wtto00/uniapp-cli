import { App } from '../../utils/app.js'
import type { Results } from '../prepare.js'
import { appendPermissions } from '../templates/AndroidManifest.xml.js'

export function appendRecord(results: Results) {
  const manifest = App.getManifestJson()
  const Record = manifest['app-plus']?.modules?.Record
  if (!Record) return

  appendPermissions(results.androidManifest, {
    'android.permission.RECORD_AUDIO': {},
    'android.permission.MODIFY_AUDIO_SETTINGS': {},
  })
}
