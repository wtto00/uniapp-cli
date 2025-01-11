import { type PLATFORM, allPlatforms, importPlatform } from './platforms/index.js'
import { errorMessage } from './utils/error.js'
import Log from './utils/log.js'

/**
 * add platforms
 */
export async function add(platforms: PLATFORM[]) {
  for (const platform of platforms) {
    if (!allPlatforms.includes(platform)) {
      Log.warn(`${platform} 不是一个有效的平台`)
      continue
    }

    const module = await importPlatform(platform)

    try {
      await module.add()
      Log.success(`${platform} 平台已成功添加`)
    } catch (error) {
      Log.error(`${platform} 平台添加失败: ${errorMessage(error)}`)
      module.remove()
    }
  }
}

/**
 * remove platforms
 */
export async function remove(platforms: PLATFORM[]) {
  for (const platform of platforms) {
    Log.debug(`移除平台: ${platform}`)
    if (!allPlatforms.includes(platform)) {
      Log.warn(`${platform} 不是一个有效的平台`)
      continue
    }
    const module = await importPlatform(platform)
    try {
      await module.remove()
      Log.success(`${platform} 平台已成功移除`)
    } catch (error) {
      Log.error(`${platform} 平台移除失败: ${errorMessage(error)}`)
    }
  }
}

/**
 * list platforms
 */
export async function list() {
  for (const platform of allPlatforms) {
    const module = await importPlatform(platform)
    const space = Array.from(Array(20 - platform.length))
      .map(() => ' ')
      .join('')
    Log.info([
      { message: `${platform}:${space}` },
      (await module.isInstalled()) ? { message: '已安装', type: 'success' } : { message: '未安装', type: 'warn' },
    ])
  }
}
