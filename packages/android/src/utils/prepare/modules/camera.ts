import { App } from '@wtto00/uniapp-common'
import { appendPermissions } from '../files/AndroidManifest.xml.js'
import { appendFeature } from '../files/dcloud_properties.xml.js'
import type { Results } from '../results.js'

export async function appendCamera(results: Results) {
  const manifest = await App.getManifestJson()

  const Camera = manifest['app-plus']?.modules?.Camera
  if (!Camera) return

  appendPermissions(results.androidManifest, {
    'android.permission.CAMERA': {},
  })

  appendFeature(results.properties, {
    name: 'Camera',
    value: 'io.dcloud.js.camera.CameraFeatureImpl',
  })
}
