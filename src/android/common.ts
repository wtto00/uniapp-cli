import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ManifestConfig } from '../utils/manifest.config'
import { androidPath } from '../utils/path'

export const currentDir = fileURLToPath(new URL('./', import.meta.url))
export const androidDir = resolve(global.projectRoot, androidPath)

export function getSignConfigEnv(manifest: ManifestConfig, isRelease?: boolean) {
  const envVars = process.env
  const buildJsonPath = resolve(global.projectRoot, 'build.json')
  let settedCount = 0
  if (manifest['app-plus'].distribute.android.keystore) {
    envVars['KEYSTORE_PATH'] = resolve(global.projectRoot, 'src', manifest['app-plus'].distribute.android.keystore)
    settedCount += 1
  }
  if (manifest['app-plus'].distribute.android.password) {
    envVars['STORE_PASSWORD'] = manifest['app-plus'].distribute.android.password
    envVars['KEY_PASSWORD'] = manifest['app-plus'].distribute.android.password
    settedCount += 2
  }
  if (manifest['app-plus'].distribute.android.aliasname) {
    envVars['KEY_ALIAS'] = manifest['app-plus'].distribute.android.aliasname
    settedCount += 1
  }
  if (settedCount < 4 && existsSync(buildJsonPath)) {
    try {
      const buildJsonStr = readFileSync(buildJsonPath, { encoding: 'utf8' })
      const buildJson = JSON.parse(buildJsonStr)
      const buildConfig = buildJson?.android?.[isRelease ? 'release' : 'debug']
      if (buildConfig) {
        if (buildConfig['alias']) envVars['KEY_ALIAS'] = buildConfig['alias']
        if (buildConfig['password']) envVars['KEY_PASSWORD'] = buildConfig['password']
        if (buildConfig['keystore'])
          envVars['KEYSTORE_PATH'] = resolve(global.projectRoot, buildConfig['storePassword'])
        if (buildConfig['storePassword']) envVars['STORE_PASSWORD'] = buildConfig['storePassword']
      }
    } catch (_error) {
      throw Error('Failed to parse build.json')
    }
  }
  return envVars
}
