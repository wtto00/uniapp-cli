import chalk from 'chalk'
import { type PLATFORM, allPlatforms, importPlatform } from './platforms/index.js'
import { errorMessage } from './utils/error.js'
import Log from './utils/log.js'
import { isInstalled } from './utils/package.js'

export async function requirements(platforms: PLATFORM[]) {
  const invalidPlatforms: string[] = []
  const validPlatforms: PLATFORM[] = platforms.reduce<PLATFORM[]>((prev, platform) => {
    if (allPlatforms.includes(platform)) prev.push(platform)
    else invalidPlatforms.push(platform)
    return prev
  }, [])

  if (invalidPlatforms.length) {
    for (const platform of invalidPlatforms) {
      Log.warn(`无效的平台: ${platform}`)
    }
    Log.info()
  }

  for (const pfm of validPlatforms) {
    Log.debug(`检查平台 ${pfm} 的开发环境要求`)
    Log.info([{ message: `${pfm}:`, type: chalk.cyan }])

    const module = await importPlatform(pfm)
    if (!module.modules.every((module) => isInstalled(module))) {
      Log.warn(`平台 ${pfm} 还没有安装。请运行 \`uniapp platform add ${pfm}\` 添加安装`)
      Log.info()
      continue
    }
    Log.success(`平台 ${pfm} 已安装`)
    try {
      await module.requirement()
    } catch (error) {
      Log.warn(`出错了: ${errorMessage(error)}`)
    }
    Log.info()
  }
}
