import { ManifestConfig } from '@uniapp-cli/common'
import { Results } from '../prepare'

export function appendBarcode(results: Results, manifest: ManifestConfig) {
  const Barcode = manifest['app-plus']?.modules?.Barcode
  if (!Barcode) return
}
