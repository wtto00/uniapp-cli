import type { ManifestConfig } from '../../utils/manifest.config.js'
import type { Results } from '../prepare.js'

export function appendFaceID(_results: Results, manifest: ManifestConfig) {
  const FaceID = manifest['app-plus']?.modules?.FaceID
  if (!FaceID) return
}
