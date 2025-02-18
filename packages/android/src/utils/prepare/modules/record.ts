import { App } from '@wtto00/uniapp-common'
import { appendPermissions } from '../files/AndroidManifest.xml.js'
import type { Results } from '../results.js'

export async function appendRecord(results: Results) {
  const manifest = await App.getManifestJson()
  const Record = manifest['app-plus']?.modules?.Record
  if (!Record) return

  appendPermissions(results.androidManifest, {
    'android.permission.RECORD_AUDIO': {},
    'android.permission.MODIFY_AUDIO_SETTINGS': {},
  })
}
