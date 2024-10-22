import type { ManifestConfig } from '../../utils/manifest.config.js'
import { appendSet } from '../../utils/util.js'
import type { Results } from '../prepare.js'
import { appendFeature } from '../templates/dcloud_properties.xml.js'

export function appendVideoPlayer(results: Results, manifest: ManifestConfig) {
  const VideoPlayer = manifest['app-plus']?.modules?.VideoPlayer
  if (!VideoPlayer) return

  appendSet(results.libs, ['media-release.aar', 'weex_videoplayer-release.aar'])

  appendFeature(results.properties, {
    name: 'VideoPlayer',
    value: 'io.dcloud.media.MediaFeatureImpl',
  })
}
