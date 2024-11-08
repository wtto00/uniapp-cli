import { resolve } from 'node:path'
import { App } from '../utils/app.js'
import { AndroidDir } from '../utils/path.js'

export const assetsAppsPath = resolve(AndroidDir, 'app/src/main/assets/apps')

export function getWwwPath() {
  const manifest = App.getManifestJson()
  return resolve(assetsAppsPath, `${manifest.appid}/www`)
}

export const devDistPath = resolve(App.projectRoot, 'dist/dev/app')
