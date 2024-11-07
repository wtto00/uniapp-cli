import { type PLATFORM, allPlatforms, importPlatform } from './platforms/index.js'
import Log from './utils/log.js'
import { getModuleVersion, isInstalled } from './utils/package.js'

/**
 * add platforms
 */
export async function add(platforms: PLATFORM[]) {
  const uniVersoin = await getModuleVersion('@dcloudio/uni-app')

  if (!uniVersoin) {
    process.exit(1)
  }

  for (const pfm of platforms) {
    if (!allPlatforms.includes(pfm)) {
      Log.error(`${pfm} is not an valid platform value.\n`)
      continue
    }

    const module = await importPlatform(pfm)

    try {
      await module.platformAdd({ version: uniVersoin })
      Log.success(`${Log.successSignal} 平台 ${pfm} 已成功添加。`)
    } catch (error) {
      module.platformRemove()
      Log.error(`${Log.failSignal} 平台 ${pfm} 添加失败: ${(error as Error).message}`)
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
      Log.success(`${Log.successSignal} 平台 ${pfm} 已成功移除。`)
    } catch (error) {
      Log.error(`${Log.failSignal} 平台 ${pfm} 移除失败: ${(error as Error).message}`)
    }
  }
}

/**
 * list platforms
 */
export async function list() {
  for (const pfm of allPlatforms) {
    const module = await importPlatform(pfm)
    const space = Array.from(Array(16 - pfm.length))
      .map(() => ' ')
      .join('')
    const isPfmInstalled = module.modules.every((module) => isInstalled(module))
    Log.info([
      { msg: `${pfm}:${space}` },
      isPfmInstalled
        ? { msg: `${Log.successSignal} Installed`, type: 'success' }
        : { msg: `${Log.failSignal} Not installed`, type: 'warn' },
    ])
  }
}
