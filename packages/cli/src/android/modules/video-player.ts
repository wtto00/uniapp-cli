import { ManifestConfig } from '@uniapp-cli/common'
import { Results } from '../prepare'

export function appendVideoPlayer(results: Results, manifest: ManifestConfig) {
  const VideoPlayer = manifest['app-plus']?.modules?.VideoPlayer
  if (!VideoPlayer) return
}
