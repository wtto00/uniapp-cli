import { ManifestConfig } from '@uniapp-cli/common'
import { Results } from '../prepare'

export function appendMessaging(results: Results, manifest: ManifestConfig) {
  const Messaging = manifest['app-plus']?.modules?.Messaging
  if (!Messaging) return
}
