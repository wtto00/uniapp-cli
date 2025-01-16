import { type BuildOptions, Log, type MaybePromise, safeAwait } from '@wtto00/uniapp-common'
import { type PLATFORM, checkPlatformValid, importPlatform } from './platforms/index.js'

export async function build(platform: PLATFORM, options: BuildOptions) {
  checkPlatformValid(platform)

  const [error, module] = await safeAwait(
    importPlatform<{ build: (options: BuildOptions) => MaybePromise }>(platform, 'build'),
  )

  if (error) {
    Log.error(error.message || '出错了')
    return
  }

  await module.build(options)
}
