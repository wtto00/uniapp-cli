import type { MaybePromise } from '@wtto00/uniapp-common'
import { type PLATFORM, allPlatforms, importPlatform } from './platforms/index.js'

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

  const module = await importPlatform<{ run: (option: RunOptions) => MaybePromise }>(platform, 'run')

  await module.run(options)
}
