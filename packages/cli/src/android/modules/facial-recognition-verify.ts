import { ManifestConfig } from '@uniapp-cli/common'
import { Results } from '../prepare'

export function appendFacialRecognitionVerify(results: Results, manifest: ManifestConfig) {
  const FacialRecognitionVerify = manifest['app-plus']?.modules?.FacialRecognitionVerify
  if (!FacialRecognitionVerify) return
}
