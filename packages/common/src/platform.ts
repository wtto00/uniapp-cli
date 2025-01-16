import { Log } from './log.js'

export type MaybePromise<T = void> = T | Promise<T>

export function logNotInstalled(platform: string) {
  Log.warn(`平台 ${platform} 还没有安装，请运行 uniapp platform add ${platform} 添加安装`)
}

export function logInstalled(platform: string) {
  Log.success(`平台 ${platform} 已安装`)
}
