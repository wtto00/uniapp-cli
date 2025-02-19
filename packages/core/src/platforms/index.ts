import { resolve } from 'node:path'
import { importFileModule } from '../utils/file.js'
import { Log } from '../utils/log.js'
import { installDependencies, isInstalled } from '../utils/package.js'

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

export function notInstalledMessage(platform: string) {
  return `平台 ${platform} 还没有安装，请运行 \`uniapp platform add ${platform}\` 添加安装`
}

export function installedMessage(platform: string) {
  return `平台 ${platform} 已安装`
}

export async function importPlatform<T extends object>(options: {
  platform: PLATFORM
  fileName: string
  tryInstall?: boolean
}): Promise<T> {
  const { platform, fileName, tryInstall } = options
  switch (platform) {
    case PLATFORM.ANDROID:
      if (!(await isInstalled('@wtto00/uniapp-android'))) {
        if (tryInstall) {
          if (process.env.UNIAPP_CLI_DEVELOPMENT_MODE) {
            // 本地开发测试
            await installDependencies([resolve(import.meta.dirname, '../../../android')])
          } else {
            await installDependencies(['@wtto00/uniapp-android'])
          }
        } else {
          throw Error(notInstalledMessage(platform))
        }
      }
      return await importFileModule(`node_modules/@wtto00/uniapp-android/dist/${fileName}.js`)
    case PLATFORM.IOS:
      throw Error('暂未实现 iOS 平台')
    case PLATFORM.HARMONY:
      throw Error('暂未实现 Harmony 平台')
    default:
      return await import(`./${platform}/${fileName}.js`)
  }
}
