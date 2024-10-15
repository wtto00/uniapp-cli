import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'

let libs: string[] = []

export function findLibSDK(prefix: string) {
  if (libs.length === 0) {
    const libsPath = resolve(global.projectRoot, 'node_modules/uniapp-android/SDK/libs')
    libs = readdirSync(libsPath, { encoding: 'utf8' })
  }
  return libs.find((file) => file.startsWith(prefix))
}
