import { type PLATFORM, allPlatforms, importPlatform } from './platforms/index.js'
import { errorMessage } from './utils/error.js'
import Log from './utils/log.js'
import { isInstalled } from './utils/package.js'

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
      await module.platformAdd()
      Log.success(`${platform} 平台已成功添加`)
    } catch (error) {
      Log.error(`${platform} 平台添加失败: ${errorMessage(error)}`)
      module.platformRemove()
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
      await module.platformRemove()
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
    const isPlatformModulesInstalled =
      module.modules.every((module) => isInstalled(module)) && (module.isInstalled?.() ?? true)
    Log.info([
      { message: `${platform}:${space}` },
      isPlatformModulesInstalled ? { message: '已安装', type: 'success' } : { message: '未安装', type: 'warn' },
    ])
  }
}
