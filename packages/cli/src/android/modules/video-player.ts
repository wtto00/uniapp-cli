import { ManifestConfig } from '@uniapp-cli/common'
import { Results } from '../prepare'
import { appendSet } from '../../utils/util'
import { appendFeature } from '../templates/dcloud_properties.xml'

export function appendVideoPlayer(results: Results, manifest: ManifestConfig) {
  const VideoPlayer = manifest['app-plus']?.modules?.VideoPlayer
  if (!VideoPlayer) return

  appendSet(results.libs, ['media-release.aar', 'weex_videoplayer-release.aar'])

  appendFeature(results.properties, {
    name: 'VideoPlayer',
    value: 'io.dcloud.media.MediaFeatureImpl',
  })
}
