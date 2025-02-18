import { App } from '@wtto00/uniapp-common'
import type { Results } from '../results.js'

export async function appendFaceID(_results: Results) {
  const manifest = await App.getManifestJson()

  const FaceID = manifest['app-plus']?.modules?.FaceID
  if (!FaceID) return
}
