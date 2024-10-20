import { ManifestConfig } from '@uniapp-cli/common'
import { Results } from '../prepare'
import { appendPermissions } from '../templates/AndroidManifest.xml'
import { appendFeature } from '../templates/dcloud_properties.xml'

export function appendCamera(results: Results, manifest: ManifestConfig) {
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
