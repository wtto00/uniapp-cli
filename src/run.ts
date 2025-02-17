import { importPlatform } from './platforms/index.js'
import { type PLATFORM, allPlatforms } from './platforms/index.js'
import { App } from './utils/app.js'
import { isInstalled } from './utils/package.js'

export interface CommonOptions {
  open: boolean
  mode?: string
}

export interface AndroidCommonOptoins {
  device?: string
  /** Android签名 */
  keystore?: string
  storepasswd?: string
  keypasswd?: string
  alias?: string
}

export interface RunOptions extends CommonOptions, AndroidCommonOptoins {
  /** Android平台是否使用HBuilderX打包运行 */
  hxcli: string | boolean
}

export async function run(platform: PLATFORM, options: RunOptions) {
  if (!allPlatforms.includes(platform)) {
    throw Error(`未知的平台: ${platform}`)
  }

  const module = await importPlatform(platform)

  if (module.modules.some((module) => !isInstalled(module))) {
    throw Error(`平台 ${platform} 还没有安装。 运行 \`uniapp platform add ${platform}\` 添加`)
  }

  if (!App.isVue3()) {
    process.env.NODE_ENV = 'development'
    process.env.UNI_PLATFORM = platform
  }

  await module.run(options)
}
