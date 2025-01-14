import { App, Log, importFileModule, installDependencies, isInstalled } from '@wtto00/uniapp-common'

// export type MaybePromise<T> = T | Promise<T>

// export class PlatformModule {
//   modules: string[] = []

//   async isInstalled() {
//     return this.modules.every((module) => isInstalled(module))
//   }

//   async requirement() {}

//   /** platform add */
//   async add() {
//     const uniVersion = App.getUniVersion()
//     await installDeps(this.modules, uniVersion)
//   }

//   /** platform remove */
//   async remove() {
//     await uninstallDeps(this.modules)
//   }

//   async run(_options: RunOptions): Promise<void> {
//     return Promise.reject(Error('暂未实现'))
//   }

//   async build(_options: BuildOptions): Promise<void> {
//     return Promise.reject(Error('暂未实现'))
//   }
// }

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

export function checkPlatformValid(platform: string) {
  if (!allPlatforms.includes(platform as PLATFORM)) {
    throw Error(`未知的平台: ${platform}`)
  }
}

export function logInvalidPlatform(platform: string) {
  Log.warn(`${platform} 不是一个有效的平台`)
}

export async function importPlatform<T extends object>(platform: PLATFORM, fileName: string): Promise<T> {
  switch (platform) {
    case PLATFORM.ANDROID:
      if (!(await isInstalled('@wtto00/uniapp-android'))) {
        await installDependencies([`@wtto00/uniapp-android@${await App.getUniVersion()}`])
      }
      return await importFileModule(`node_modules/@wtto00/uniapp-android/dist/${fileName}.js`)
    case PLATFORM.IOS:
      throw Error('暂未实现')
    case PLATFORM.HARMONY:
      throw Error('暂未实现')
    default:
      return await import(`../${platform}/${fileName}.js`)
  }
}
