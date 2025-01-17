import { Log, type MaybePromise, type PublishOptions, safeAwait } from '@wtto00/uniapp-common'
import { type PLATFORM, checkPlatformValid, importPlatform } from './platforms/index.js'

export async function publish(platform: PLATFORM, options: PublishOptions) {
  checkPlatformValid(platform)

  const [error, module] = await safeAwait(
    importPlatform<{ publish: (options: PublishOptions) => MaybePromise }>({ platform, fileName: 'publish' }),
  )
  if (error) {
    Log.error(error.message || '出错了')
    return
  }
  await module.publish(options)
}
