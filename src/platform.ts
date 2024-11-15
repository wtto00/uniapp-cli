import { type PLATFORM, allPlatforms, importPlatform } from './platforms/index.js'
import { App } from './utils/app.js'
import Log from './utils/log.js'
import { isInstalled } from './utils/package.js'

/**
 * add platforms
 */
export async function add(platforms: PLATFORM[]) {
  const uniVersoin = App.getUniVersion()

  for (const pfm of platforms) {
    if (!allPlatforms.includes(pfm)) {
      Log.error(`${pfm} 不是一个有效的平台。\n`)
      continue
    }

    const module = await importPlatform(pfm)

    try {
      await module.platformAdd({ version: uniVersoin })
      Log.success(`平台 ${pfm} 已成功添加`)
    } catch (error) {
      Log.error(`平台 ${pfm} 添加失败: ${(error as Error).message}`)
      module.platformRemove()
    }
  }
}

/**
 * remove platforms
 */
export async function remove(platforms: PLATFORM[]) {
  for (const pfm of platforms) {
    Log.debug(`移除平台: ${pfm}`)
    if (!allPlatforms.includes(pfm)) {
      Log.error(`${pfm} 不是一个有效的平台。\n`)
      continue
    }
    const module = await importPlatform(pfm)
    try {
      await module.platformRemove()
      Log.success(`平台 ${pfm} 已成功移除`)
    } catch (error) {
      Log.error(`平台 ${pfm} 移除失败: ${(error as Error).message}`)
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
      { msg: `${platform}:${space}` },
      isPlatformModulesInstalled ? { msg: '已安装', type: 'success' } : { msg: '未安装', type: 'warn' },
    ])
  }
}
