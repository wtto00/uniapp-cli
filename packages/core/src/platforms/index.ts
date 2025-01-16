import {
  App,
  Log,
  importFileModule,
  installDependencies,
  isInstalled,
  uninstallDependencies,
} from '@wtto00/uniapp-common'

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

export const BasePlatform = {
  name: PLATFORM.H5,
  dependencies: [] as string[],

  async isInstalled() {
    for (const dependencyName of this.dependencies) {
      if (!(await isInstalled(dependencyName))) return false
    }
    return true
  },

  async checkInstalled() {
    if (!(await this.isInstalled())) {
      throw Error(`平台 ${this.name} 还没有安装。 运行 uniapp platform add ${this.name} 添加`)
    }
  },

  async add() {
    const uniVersion = await App.getUniVersion()
    await installDependencies(this.dependencies.map((dependencyName) => `${dependencyName}@${uniVersion}`))
  },

  async remove() {
    await uninstallDependencies(this.dependencies)
  },
}

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
        throw Error('平台 android 还没有安装，请运行 uniapp platform add android 添加安装')
      }
      return await importFileModule(`node_modules/@wtto00/uniapp-android/dist/${fileName}.js`)
    case PLATFORM.IOS:
      throw Error('暂未实现 iOS 平台')
    case PLATFORM.HARMONY:
      throw Error('暂未实现 Harmony 平台')
    default:
      return await import(`../${platform}/${fileName}.js`)
  }
}
