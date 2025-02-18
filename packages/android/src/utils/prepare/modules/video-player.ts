import { App } from '@wtto00/uniapp-common'
import { appendFeature } from '../files/dcloud_properties.xml.js'
import type { Results } from '../results.js'
import { appendSet } from '../xml.js'

export async function appendVideoPlayer(results: Results) {
  const manifest = await App.getManifestJson()
  const VideoPlayer = manifest['app-plus']?.modules?.VideoPlayer
  if (!VideoPlayer) return

  appendSet(results.libs, ['media-release.aar', 'weex_videoplayer-release.aar'])

  appendFeature(results.properties, {
    name: 'VideoPlayer',
    value: 'io.dcloud.media.MediaFeatureImpl',
  })
}
