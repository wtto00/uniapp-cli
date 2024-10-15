import { ManifestConfig } from '@uniapp-cli/common'
import { Results } from '../prepare'

export function appendIBeacon(results: Results, manifest: ManifestConfig) {
  const iBeacon = manifest['app-plus']?.modules?.iBeacon
  if (!iBeacon) return
}
