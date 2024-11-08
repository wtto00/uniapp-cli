import { App } from '../../utils/app.js'
import { appendSet } from '../../utils/util.js'
import type { Results } from '../prepare.js'
import { appendFeature } from '../templates/dcloud_properties.xml.js'

export function appendVideoPlayer(results: Results) {
  const manifest = App.getManifestJson()
  const VideoPlayer = manifest['app-plus']?.modules?.VideoPlayer
  if (!VideoPlayer) return

  appendSet(results.libs, ['media-release.aar', 'weex_videoplayer-release.aar'])

  appendFeature(results.properties, {
    name: 'VideoPlayer',
    value: 'io.dcloud.media.MediaFeatureImpl',
  })
}
