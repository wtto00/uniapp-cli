import type { BuildOptions } from './build.js'
import { importPlatform } from './platforms/index.js'
import { type PLATFORM, allPlatforms } from './platforms/index.js'
import { Log } from './utils/log.js'
import { isInstalled } from './utils/package.js'

export async function run(platform: PLATFORM, options: BuildOptions) {
  if (!allPlatforms.includes(platform)) {
    Log.error(`Unknown platform: ${platform}.`)
    return
  }

  const module = await importPlatform(platform)

  if (module.modules.some((module) => !isInstalled(module))) {
    Log.error(`Platform ${platform} has not been installed. Run \`uni platform add ${platform}\` to add this platform.`)
    return
  }

  await module.run(options)
}
