import { ManifestConfig } from '../../utils/manifest.config'
import { Results } from '../prepare'
import { appendPermissions } from '../templates/AndroidManifest.xml'
import { appendFeature } from '../templates/dcloud_properties.xml'

export function appendBarcode(results: Results, manifest: ManifestConfig) {
  const Barcode = manifest['app-plus']?.modules?.Barcode
  if (!Barcode) return

  appendPermissions(results.androidManifest, {
    'android.permission.CAMERA': {},
    'android.hardware.camera': {},
    'android.hardware.camera.autofocus': {},
    'android.permission.VIBRATE': {},
    'android.permission.FLASHLIGHT': {},
  })

  appendFeature(results.properties, {
    name: 'Barcode',
    value: 'io.dcloud.feature.barcode2.BarcodeFeatureImpl',
  })
}
