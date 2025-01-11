import type { BuildOptions } from '../build.js'
import type { RunOptions } from '../run.js'
import { App } from '../utils/app.js'
import { installDeps, isInstalled, uninstallDeps } from '../utils/package.js'

export type MaybePromise<T> = T | Promise<T>

export class PlatformModule {
  modules: string[] = []

  async isInstalled() {
    return this.modules.every((module) => isInstalled(module))
  }

  async requirement() {}

  /** platform add */
  async add() {
    const uniVersion = App.getUniVersion()
    await installDeps(this.modules, uniVersion)
  }

  /** platform remove */
  async remove() {
    await uninstallDeps(this.modules)
  }

  async run(_options: RunOptions): Promise<void> {
    return Promise.reject(Error('暂未实现'))
  }

  async build(_options: BuildOptions): Promise<void> {
    return Promise.reject(Error('暂未实现'))
  }
}

export enum PLATFORM {
  H5 = 'h5',
  ANDROID = 'android',
  IOS = 'ios',
  HARMONY = 'harmony',
  MP_WEIXIN = 'mp-weixin',
  MP_ALIPAY = 'mp-alipay',
  MP_BAIDU = 'mp-baidu',
  MP_TOUTIAO = 'mp-toutiao',
  MP_LARK = 'mp-lark',
  MP_QQ = 'mp-qq',
  MP_KUAISHOU = 'mp-kuaishou',
  MP_JD = 'mp-jd',
  MP_360 = 'mp-360',
  MP_XHS = 'mp-xhs',
  MP_QUICKAPP_UNION = 'quickapp-union',
  MP_QUICKAPP_HUAWEI = 'quickapp-huawei',
}
export const allPlatforms: PLATFORM[] = Object.values(PLATFORM)

export async function importPlatform(platform: PLATFORM): Promise<PlatformModule> {
  switch (platform) {
    case PLATFORM.ANDROID:
      return (await import('./android.js')).default.instance
    case PLATFORM.IOS:
      return (await import('./ios.js')).default.instance
    case PLATFORM.HARMONY:
      return (await import('./harmony.js')).default.instance
    case PLATFORM.H5:
      return (await import('./h5.js')).default.instance
    case PLATFORM.MP_WEIXIN:
      return (await import('./mp-weixin.js')).default.instance
    case PLATFORM.MP_ALIPAY:
      return (await import('./mp-alipay.js')).default.instance
    case PLATFORM.MP_BAIDU:
      return (await import('./mp-baidu.js')).default.instance
    case PLATFORM.MP_TOUTIAO:
      return (await import('./mp-toutiao.js')).default.instance
    case PLATFORM.MP_LARK:
      return (await import('./mp-lark.js')).default.instance
    case PLATFORM.MP_QQ:
      return (await import('./mp-qq.js')).default.instance
    case PLATFORM.MP_KUAISHOU:
      return (await import('./mp-kuaishou.js')).default.instance
    case PLATFORM.MP_JD:
      return (await import('./mp-jd.js')).default.instance
    case PLATFORM.MP_360:
      return (await import('./mp-360.js')).default.instance
    case PLATFORM.MP_XHS:
      return (await import('./mp-xhs.js')).default.instance
    case PLATFORM.MP_QUICKAPP_UNION:
      return (await import('./quickapp-union.js')).default.instance
    case PLATFORM.MP_QUICKAPP_HUAWEI:
      return (await import('./quickapp-huawei.js')).default.instance
    default:
      throw Error(`未知的平台: ${platform}`)
  }
}
