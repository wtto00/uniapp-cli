import { readdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { App, UNIAPP_SDK_HOME } from '@wtto00/uniapp-common'

const libs: string[] = []

export async function findLibSDK(prefix: string) {
  if (libs.length === 0) {
    const sdkVersion = await App.getUniVersion()
    const libsPath = resolve(UNIAPP_SDK_HOME, 'android', sdkVersion)
    libs.push(...(await readdir(libsPath)))
  }
  return libs.find((file) => file.startsWith(prefix))
}
