import { ManifestConfig } from '@uniapp-cli/common'
import { Results } from '../prepare'

export function appendLivePusher(results: Results, manifest: ManifestConfig) {
  const LivePusher = manifest['app-plus']?.modules?.LivePusher
  if (!LivePusher) return
}
