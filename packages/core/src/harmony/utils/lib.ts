import { resolve } from 'node:path'
import { UNIAPP_SDK_HOME } from '../../utils/path.js'

export function getLibSDKDir(sdkVersion: string) {
  return resolve(UNIAPP_SDK_HOME, 'harmony', sdkVersion)
}
