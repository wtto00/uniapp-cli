import { type PLATFORM, allPlatforms, importPlatform } from './platforms/index.js'
import Log from './utils/log.js'
import { isInstalled } from './utils/package.js'

export async function requirements(platforms: PLATFORM[]) {
  const validPlatforms: PLATFORM[] = platforms.reduce<PLATFORM[]>((prev, pfm) => {
    if (allPlatforms.includes(pfm)) prev.push(pfm)
    else Log.warn(`无效的平台: ${pfm}`)
    return prev
  }, [])

  for (const pfm of validPlatforms) {
    Log.debug(`check requirements of ${pfm}`)
    Log.info(`${pfm}: `)

    const module = await importPlatform(pfm)
    if (!module.modules.every((module) => isInstalled(module))) {
      Log.error(`平台 \`${pfm}\` 还没有安装。请运行 \`uniapp platform add ${pfm}\` 添加安装`)
      continue
    }
    Log.success(`平台 \`${pfm}\` 已安装`)
    await module.requirement()
    Log.info()
  }
}
