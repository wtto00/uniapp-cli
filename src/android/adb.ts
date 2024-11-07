import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { execa } from 'execa'
import { isWindows } from '../utils/util.js'

export function findAdbPath() {
  const adbName = isWindows() ? 'adb.exe' : 'adb'
  if (process.env.ANDROID_HOME) {
    const adbPath = resolve(process.env.ANDROID_HOME, 'platform-tools', adbName)
    if (existsSync(adbPath)) return adbPath
  }
  throw Error('没有找到 adb 可执行文件')
}

export function devices(adbPath: string) {
  return execa`${adbPath} devices`
}
