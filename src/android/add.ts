import { cpSync } from 'node:fs'
import { resolve } from 'node:path'
import { checkConfig } from '../app-plus/check.js'
import { App } from '../utils/app.js'
import { AppPlusOS } from '../utils/manifest.config.js'
import { AndroidDir } from '../utils/path.js'
import { prepare } from './prepare.js'

export default async function add(version: string) {
  const manifest = App.getManifestJson()

  if (!manifest) {
    throw Error('Failed to parse manifest.json.')
  }

  checkConfig(manifest, AppPlusOS.Android)

  cpSync(resolve(import.meta.dirname, '../../templates/android'), AndroidDir, { recursive: true })

  prepare(manifest, version)
}
