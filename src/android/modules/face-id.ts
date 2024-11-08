import { App } from '../../utils/app.js'
import type { Results } from '../prepare.js'

export function appendFaceID(_results: Results) {
  const manifest = App.getManifestJson()
  const FaceID = manifest['app-plus']?.modules?.FaceID
  if (!FaceID) return
}
