import { ManifestConfig } from '@uniapp-cli/common'
import { Results } from '../prepare'

export function appendFaceID(results: Results, manifest: ManifestConfig) {
  const FaceID = manifest['app-plus']?.modules?.FaceID
  if (!FaceID) return
}
