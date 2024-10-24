import { cpSync } from 'node:fs'
import { resolve } from 'node:path'
import { checkConfig } from '../app-plus/check.js'
import { AppPlusOS } from '../utils/manifest.config.js'
import { getManifestJson } from '../utils/manifest.js'
import { androidDir } from '../utils/path.js'
import { prepare } from './prepare.js'

export default async function add(version: string) {
  const manifest = getManifestJson()

  if (!manifest) {
    throw Error('Failed to parse manifest.json.')
  }

  checkConfig(manifest, AppPlusOS.Android)

  cpSync(resolve(import.meta.dirname, '../../sdk/android'), androidDir, { recursive: true })

  prepare(manifest, version)
}
