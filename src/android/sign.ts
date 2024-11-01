import { resolve } from 'node:path'
import { App } from '../utils/app.js'
import type { ManifestConfig } from '../utils/manifest.config.js'

export interface SignConfig {
  KEYSTORE_PATH?: string
  STORE_PASSWORD?: string
  KEY_PASSWORD?: string
  KEY_ALIAS?: string
}

export function getSignConfig(manifest: ManifestConfig) {
  const config = {
    KEYSTORE_PATH: process.env.KEYSTORE_PATH,
    STORE_PASSWORD: process.env.STORE_PASSWORD,
    KEY_PASSWORD: process.env.KEY_PASSWORD,
    KEY_ALIAS: process.env.KEY_ALIAS,
  } satisfies SignConfig
  const { keystore, password, aliasname } = manifest['app-plus']?.distribute?.android ?? {}
  if (keystore) {
    config.KEYSTORE_PATH = resolve(App.projectRoot, 'src', keystore)
  }
  if (password) {
    config.STORE_PASSWORD = password
    config.KEY_PASSWORD = password
  }
  if (aliasname) {
    config.KEY_ALIAS = aliasname
  }
  return config
}
