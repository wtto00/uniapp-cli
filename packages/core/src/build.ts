import { type PLATFORM, checkPlatformValid, importPlatform } from './platforms/index.js'
import { Log } from './utils/log.js'
import { getProjectInfo } from './utils/project.js'
import { type MaybePromise, safeAwait } from './utils/util.js'

declare global {
  interface UniBuildOptions extends UniRunOptions {
    /**
     * 打包产物
     * - Android: aab, apk(默认), wgt
     * - Harmony: hap(默认), app
     */
    bundle?: 'aab' | 'apk' | 'wgt' | 'hap' | 'app'
  }
}

export async function build(platform: PLATFORM, options: UniBuildOptions) {
  checkPlatformValid(platform)

  const [error, module] = await safeAwait(
    importPlatform<{ build: (projectInfo: ProjectInfo, options: UniBuildOptions) => MaybePromise }>({
      platform,
      fileName: 'build',
    }),
  )

  if (error) {
    Log.error(error.message || '出错了')
    return
  }

  const info = await getProjectInfo()

  await module.build(info, options)
}
