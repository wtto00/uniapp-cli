import { Log, type MaybePromise, type RunOptions, safeAwait } from '@wtto00/uniapp-common'
import { type PLATFORM, checkPlatformValid, importPlatform } from './platforms/index.js'

export async function run(platform: PLATFORM, options: RunOptions) {
  checkPlatformValid(platform)

  const [error, module] = await safeAwait(
    importPlatform<{ run: (option: RunOptions) => MaybePromise }>({ platform, fileName: 'run' }),
  )

  if (error) {
    Log.error(error.message || '出错了')
    return
  }

  await module.run(options)
}
