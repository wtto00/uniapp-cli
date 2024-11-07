import { resolve } from 'node:path'
import { App } from '../utils/app.js'
import type { ManifestConfig } from '../utils/manifest.config.js'

export interface SignConfig {
  KEYSTORE_PATH?: string
  STORE_PASSWORD?: string
  KEY_PASSWORD?: string
  KEY_ALIAS?: string
}

export function initSignEnv(manifest: ManifestConfig) {
  const { keystore, password, aliasname } = manifest['app-plus']?.distribute?.android ?? {}
  if (keystore) {
    process.env.KEYSTORE_PATH = resolve(App.projectRoot, 'src', keystore)
  }
  if (password) {
    process.env.STORE_PASSWORD = password
    process.env.KEY_PASSWORD = password
  }
  if (aliasname) {
    process.env.KEY_ALIAS = aliasname
  }
}
