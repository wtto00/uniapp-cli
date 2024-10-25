import { homedir } from 'node:os'
import { resolve } from 'node:path'

export const projectRoot = process.cwd()

export const androidPath = 'platforms/android'
export const iosPath = 'platforms/ios'

export const androidDir = resolve(projectRoot, androidPath)
export const iosDir = resolve(projectRoot, iosPath)

export const UNIAPP_SDK_HOME = process.env.UNIAPP_SDK_HOME || resolve(homedir(), '.uniapp')
