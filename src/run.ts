import type { BuildOptions } from './build.js'
import { importPlatform } from './platforms/index.js'
import { type PLATFORM, allPlatforms } from './platforms/index.js'
import Log from './utils/log.js'
import { isInstalled } from './utils/package.js'

export async function run(platform: PLATFORM, options: BuildOptions) {
  if (!allPlatforms.includes(platform)) {
    Log.error(`Unknown platform: ${platform}.`)
    return
  }

  const module = await importPlatform(platform)

  if (module.modules.some((module) => !isInstalled(module))) {
    Log.error(`平台 ${platform} 还没有安装. 运行 \`uniapp platform add ${platform}\` 来添加这个平台`)
    return
  }

  await module.run(options)
}
