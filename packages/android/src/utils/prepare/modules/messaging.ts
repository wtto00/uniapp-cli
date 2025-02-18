import { App } from '@wtto00/uniapp-common'
import { appendPermissions } from '../files/AndroidManifest.xml.js'
import { appendFeature } from '../files/dcloud_properties.xml.js'
import type { Results } from '../results.js'

export async function appendMessaging(results: Results) {
  const manifest = await App.getManifestJson()
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
