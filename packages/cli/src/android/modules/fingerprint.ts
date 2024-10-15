import { ManifestConfig } from '@uniapp-cli/common'
import { Results } from '../prepare'

export function appendFaceID(results: Results, manifest: ManifestConfig) {
  const Fingerprint = manifest['app-plus']?.modules?.Fingerprint
  if (!Fingerprint) return
}
