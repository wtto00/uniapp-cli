import type { BuildOptions } from '../build.js'
import type { RunOptions } from '../run.js'
import { App } from '../utils/app.js'
import { installDeps, isInstalled, uninstallDeps } from '../utils/package.js'

export type MaybePromise<T> = T | Promise<T>

export const NotImplemented = Promise.reject(Error('暂未实现'))

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
    return NotImplemented
  }

  async build(_options: BuildOptions): Promise<void> {
    return NotImplemented
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
      return new (await import('./android.js')).PlatformAndroid()
    case PLATFORM.IOS:
      return new (await import('./ios.js')).PlatformIOS()
    case PLATFORM.HARMONY:
      return new (await import('./harmony.js')).PlatformHarmony()
    case PLATFORM.H5:
      return new (await import('./h5.js')).PlatformH5()
    case PLATFORM.MP_WEIXIN:
      return new (await import('./mp-weixin.js')).PlatformMPWeixin()
    case PLATFORM.MP_ALIPAY:
      return new (await import('./mp-alipay.js')).PlatformMPAlipay()
    case PLATFORM.MP_BAIDU:
      return new (await import('./mp-baidu.js')).PlatformMPBaidu()
    case PLATFORM.MP_TOUTIAO:
      return new (await import('./mp-toutiao.js')).PlatformMPToutiao()
    case PLATFORM.MP_LARK:
      return new (await import('./mp-lark.js')).PlatformMPLark()
    case PLATFORM.MP_QQ:
      return new (await import('./mp-qq.js')).PlatformMPQQ()
    case PLATFORM.MP_KUAISHOU:
      return new (await import('./mp-kuaishou.js')).PlatformMPKuaishou()
    case PLATFORM.MP_JD:
      return new (await import('./mp-jd.js')).PlatformMPJD()
    case PLATFORM.MP_360:
      return new (await import('./mp-360.js')).PlatformMP360()
    case PLATFORM.MP_XHS:
      return new (await import('./mp-xhs.js')).PlatformMPXhs()
    case PLATFORM.MP_QUICKAPP_UNION:
      return new (await import('./quickapp-union.js')).PlatformQuickappWebview()
    case PLATFORM.MP_QUICKAPP_HUAWEI:
      return new (await import('./quickapp-huawei.js')).PlatformQuickappHuawei()
    default:
      throw Error(`未知的平台: ${platform}`)
  }
}
