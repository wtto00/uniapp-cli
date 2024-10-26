import { type PLATFORM, allPlatforms, importPlatform } from './platforms/index.js'
import { Log } from './utils/log.js'
import { isInstalled } from './utils/package.js'

export async function requirements(platforms: PLATFORM[]) {
  const validPlatforms: PLATFORM[] = platforms.reduce<PLATFORM[]>((prev, pfm) => {
    if (allPlatforms.includes(pfm)) prev.push(pfm)
    return prev
  }, [])

  for (const pfm of validPlatforms) {
    Log.debug(`check requirements of ${pfm}`)
    Log.info(`${pfm}: `)

    const module = await importPlatform(pfm)
    if (!module.modules.every((module) => isInstalled(module))) {
      Log.error(`${Log.failEmoji} 平台 \`${pfm}\` 还没有安装. 请运行 \`uniapp platform add ${pfm}\` 。`)
      continue
    }
    await module.requirement()

    Log.info()
  }
}
