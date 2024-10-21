import { resolve } from 'node:path'

export const androidPath = 'platforms/android'
export const iosPath = 'platforms/ios'

export const androidDir = resolve(global.projectRoot, androidPath)
