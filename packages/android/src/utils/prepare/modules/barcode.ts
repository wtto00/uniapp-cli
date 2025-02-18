import { App } from '@wtto00/uniapp-common'
import { appendPermissions } from '../files/AndroidManifest.xml.js'
import { appendFeature } from '../files/dcloud_properties.xml.js'
import type { Results } from '../results.js'

export async function appendBarcode(results: Results) {
  const manifest = await App.getManifestJson()

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
