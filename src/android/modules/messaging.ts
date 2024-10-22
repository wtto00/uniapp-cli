import type { ManifestConfig } from '../../utils/manifest.config.js'
import type { Results } from '../prepare.js'
import { appendPermissions } from '../templates/AndroidManifest.xml.js'
import { appendFeature } from '../templates/dcloud_properties.xml.js'

export function appendMessaging(results: Results, manifest: ManifestConfig) {
  const Messaging = manifest['app-plus']?.modules?.Messaging
  if (!Messaging) return

  results.libs.add('messaging-release.aar')

  appendPermissions(results.androidManifest, {
    'android.permission.RECEIVE_SMS': {},
    'android.permission.SEND_SMS': {},
    'android.permission.WRITE_SMS': {},
    'android.permission.READ_SMS': {},
  })

  appendFeature(results.properties, {
    name: 'Messaging',
    value: 'io.dcloud.adapter.messaging.MessagingPluginImpl',
  })
}
