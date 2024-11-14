import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { UNIAPP_SDK_HOME } from '../utils/path.js'

let libs: string[] = []

export function getLibSDKDir(sdkVersion: string) {
  return resolve(UNIAPP_SDK_HOME, 'android', sdkVersion)
}

export function findLibSDK(prefix: string, sdkVersion: string) {
  if (libs.length === 0) {
    const libsPath = getLibSDKDir(sdkVersion)
    libs = readdirSync(libsPath)
  }
  return libs.find((file) => file.startsWith(prefix))
}

export const resourceSizes = ['ldpi', 'mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi'] as const
