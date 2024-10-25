import { type PLATFORM, allPlatforms, importPlatform } from './platforms/index.js'
import { Log } from './utils/log.js'
import { Package, getModuleVersion, isInstalled } from './utils/package.js'

/**
 * add platforms
 */
export async function add(platforms: PLATFORM[]) {
  const uniVersoin = await getModuleVersion(Package.packages, '@dcloudio/uni-app')

  if (!uniVersoin) {
    process.exit()
  }

  for (const pfm of platforms) {
    if (!allPlatforms.includes(pfm)) {
      Log.error(`${pfm} is not an valid platform value.\n`)
      continue
    }

    const module = await importPlatform(pfm)

    try {
      await module.platformAdd({ version: uniVersoin })
    } catch (error) {
      module.platformRemove()
      Log.error((error as Error).message)
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
    await module.platformRemove()
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
    const isPfmInstalled = module.modules.every((module) => isInstalled(Package.packages, module))
    Log.info([
      { msg: `${pfm}:${space}` },
      isPfmInstalled
        ? { msg: `${Log.successEmoji} Installed`, type: 'success' }
        : { msg: `${Log.failEmoji} Not installed`, type: 'warn' },
    ])
  }
}
