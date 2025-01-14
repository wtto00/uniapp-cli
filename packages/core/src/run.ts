import type { MaybePromise, RunOptions } from '@wtto00/uniapp-common'
import { type PLATFORM, checkPlatformValid, importPlatform } from './platforms/index.js'

export async function run(platform: PLATFORM, options: RunOptions) {
  checkPlatformValid(platform)

  const module = await importPlatform<{ run: (option: RunOptions) => MaybePromise }>(platform, 'run')

  await module.run(options)
}
