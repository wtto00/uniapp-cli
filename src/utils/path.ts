import { homedir } from 'node:os'
import { resolve } from 'node:path'

export const androidPath = 'platforms/android'
export const iosPath = 'platforms/ios'

export const androidDir = resolve(global.projectRoot, androidPath)

export const UNIAPP_SDK_HOME = process.env.UNIAPP_SDK_HOME || resolve(homedir(), '.uniapp')
