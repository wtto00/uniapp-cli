import { resolve } from 'node:path'
import type { BuildOptions } from '../build.js'
import { App } from '../utils/app.js'

export interface SignConfig {
  KEYSTORE_PATH?: string
  STORE_PASSWORD?: string
  KEY_PASSWORD?: string
  KEY_ALIAS?: string
}

export function initSignEnv(options?: BuildOptions) {
  const manifest = App.getManifestJson()
  const { keystore, password, aliasname } = manifest['app-plus']?.distribute?.android ?? {}
  if (options?.keystore) {
    process.env.KEYSTORE_PATH = resolve(App.projectRoot, options.keystore)
  } else if (keystore) {
    process.env.KEYSTORE_PATH = resolve(App.projectRoot, 'src', keystore)
  }

  if (options?.storepasswd) {
    process.env.STORE_PASSWORD = options.storepasswd
  } else if (password) {
    process.env.STORE_PASSWORD = password
  }

  if (options?.keypasswd) {
    process.env.KEY_PASSWORD = options.keypasswd
  } else if (password) {
    process.env.KEY_PASSWORD = password
  }

  if (options?.alias) {
    process.env.KEY_ALIAS = options.alias
  } else if (aliasname) {
    process.env.KEY_ALIAS = aliasname
  }
}
