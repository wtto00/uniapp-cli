import type { BuildOptions, MaybePromise } from '@wtto00/uniapp-common'
import { type PLATFORM, checkPlatformValid, importPlatform } from './platforms/index.js'

export async function build(platform: PLATFORM, options: BuildOptions) {
  checkPlatformValid(platform)

  const module = await importPlatform<{ build: (options: BuildOptions) => MaybePromise }>(platform, 'build')

  await module.build(options)
}
