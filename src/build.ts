import { type PLATFORM, allPlatforms, importPlatform } from './platforms/index.js'
import Log from './utils/log.js'
import { isInstalled } from './utils/package.js'

export interface BuildOptions {
  open: boolean
  device?: string
}

export async function build(platform: PLATFORM, options: BuildOptions) {
  if (!allPlatforms.includes(platform)) {
    Log.error(`Unknown platform: ${platform}.`)
    return
  }

  const module = await importPlatform(platform)

  if (module.modules.some((module) => !isInstalled(module))) {
    Log.error(
      `Platform ${platform} has not been installed. Run \`uniapp platform add ${platform}\` to add this platform.`,
    )
    return
  }

  await module.build(options)
}
