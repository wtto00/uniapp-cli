import { ManifestConfig } from '@uniapp-cli/common'
import { Results } from '../prepare'

export function appendRecord(results: Results, manifest: ManifestConfig) {
  const Record = manifest['app-plus']?.modules?.Record
  if (!Record) return
}
