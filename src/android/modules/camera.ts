import type { ManifestConfig } from '../../utils/manifest.config.js'
import type { Results } from '../prepare.js'
import { appendPermissions } from '../templates/AndroidManifest.xml.js'
import { appendFeature } from '../templates/dcloud_properties.xml.js'

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
