import { resolve } from 'node:path'
import { App, type BuildOptions, Log } from '@wtto00/uniapp-common'

export interface SignConfig {
  KEYSTORE_PATH?: string
  STORE_PASSWORD?: string
  KEY_PASSWORD?: string
  KEY_ALIAS?: string
}

export async function initSignEnv(options?: BuildOptions) {
  const manifest = await App.getManifestJson()
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

export function checkSignEnv(): boolean {
  if (['KEYSTORE_PATH', 'STORE_PASSWORD', 'KEY_PASSWORD', 'KEY_ALIAS'].some((item) => !process.env[item])) {
    Log.warn(
      '缺少签名配置,请在文件manifest.json中配置打包签名: app-plus.distribute.android.[keystore|password|aliasname]',
    )
    return false
  }
  return true
}
