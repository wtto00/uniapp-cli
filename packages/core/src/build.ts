import { type PLATFORM, allPlatforms, importPlatform } from './platforms/index.js'
import type { AndroidCommonOptoins, CommonOptions } from './run.js'
import { App } from './utils/app.js'
import Log from './utils/log.js'
import { isInstalled } from './utils/package.js'

export type AndroidBundle = 'apk' | 'aab' | 'wgt'

export type HarmonyBundle = 'hap' | 'har' | 'hsp' | 'app'

export interface BuildOptions extends CommonOptions, AndroidCommonOptoins {
  /** Android打包产物类型 */
  bundle?: AndroidBundle | HarmonyBundle
}

export async function build(platform: PLATFORM, options: BuildOptions) {
  if (!allPlatforms.includes(platform)) {
    Log.error(`未知的平台: ${platform}`)
    return
  }

  const module = await importPlatform(platform)

  if (module.modules.some((module) => !isInstalled(module))) {
    throw Error(`平台 ${platform} 还没有安装。 运行 \`uniapp platform add ${platform}\` 添加`)
  }

  if (!App.isVue3()) {
    process.env.NODE_ENV = 'production'
    process.env.UNI_PLATFORM = platform
  }

  await module.build(options)
}
