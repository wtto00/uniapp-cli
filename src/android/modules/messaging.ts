import { ManifestConfig } from '../../utils/manifest.config'
import { Results } from '../prepare'
import { appendPermissions } from '../templates/AndroidManifest.xml'
import { appendFeature } from '../templates/dcloud_properties.xml'

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
