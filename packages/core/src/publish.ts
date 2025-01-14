import { Log, type MaybePromise, type PublishOptions, safeAwait } from '@wtto00/uniapp-common'
import { type PLATFORM, checkPlatformValid, importPlatform } from './platforms/index.js'

export async function publish(platform: PLATFORM, options: PublishOptions) {
  checkPlatformValid(platform)

  const [error, module] = await safeAwait(
    importPlatform<{ publish: (options: PublishOptions) => MaybePromise }>(platform, 'publish'),
  )
  if (error) {
    Log.warn(`${platform} 平台暂不支持 publish 方法`)
    return
  }
  await module.publish(options)
}
