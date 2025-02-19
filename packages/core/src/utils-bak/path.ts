import { homedir } from 'node:os'
import { relative, resolve } from 'node:path'
import { App } from './app.js'

export const AndroidPath = 'platforms/android'
export const IOSPath = 'platforms/ios'
export const HarmonyPath = 'platforms/harmony'

export const AndroidDir = resolve(App.projectRoot, AndroidPath)
export const IOSDir = resolve(App.projectRoot, IOSPath)
export const HarmonyDir = resolve(App.projectRoot, HarmonyPath)

export const UNIAPP_SDK_HOME = process.env.UNIAPP_SDK_HOME || resolve(homedir(), '.uniapp')

export function getRelativePath(filePath: string) {
  return relative(App.projectRoot, filePath)
}

export const TemplateDir = resolve(import.meta.dirname, '../../templates')
