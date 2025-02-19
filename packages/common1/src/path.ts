import { homedir } from 'node:os'
import { join, relative, resolve } from 'node:path'
import { App } from './app.js'

export const AndroidPath = 'platforms/android'
export const IOSPath = 'platforms/ios'
export const HarmonyPath = 'platforms/harmony'

export const AndroidDir = join(App.projectRoot, AndroidPath)
export const IOSDir = join(App.projectRoot, IOSPath)
export const HarmonyDir = join(App.projectRoot, HarmonyPath)

export const UNIAPP_SDK_HOME = process.env.UNIAPP_SDK_HOME || resolve(homedir(), '.uniapp')

export function getRelativePath(filePath: string) {
  return relative(App.projectRoot, filePath)
}

export const TemplateDir = resolve(import.meta.dirname, '../../templates')
