import { type PLATFORM, allPlatforms, importPlatform } from './platforms/index.js'
import { Log } from './utils/log.js'
import { checkIsUniapp, getModuleVersion, getPackageJson, isInstalled } from './utils/package.js'

/**
 * add platforms
 */
export async function add(platforms: PLATFORM[]) {
  const packages = await getPackageJson()
  checkIsUniapp(packages)

  const uniVersoin = await getModuleVersion(packages, '@dcloudio/uni-app')

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
      await module.platformAdd({ packages, version: uniVersoin })
    } catch (error) {
      module.platformRemove({ packages })
      Log.error((error as Error).message)
    }
  }
}

/**
 * remove platforms
 */
export async function remove(platforms: PLATFORM[]) {
  const packages = await getPackageJson()
  checkIsUniapp(packages)

  for (const pfm of platforms) {
    Log.debug(`移除平台: ${pfm}`)
    if (!allPlatforms.includes(pfm)) {
      Log.error(`${pfm} 不是一个有效的平台。\n`)
      continue
    }
    const module = await importPlatform(pfm)
    await module.platformRemove({ packages })
  }
}

/**
 * list platforms
 */
export async function list() {
  const packages = await getPackageJson()
  checkIsUniapp(packages)

  for (const pfm of allPlatforms) {
    const module = await importPlatform(pfm)
    const space = Array.from(Array(16 - pfm.length))
      .map(() => ' ')
      .join('')
    const isPfmInstalled = module.modules.every((module) => isInstalled(packages, module))
    Log.info([
      { msg: `${pfm}:${space}` },
      isPfmInstalled
        ? { msg: `${Log.emoji.success} Installed`, type: 'success' }
        : { msg: `${Log.emoji.fail} Not installed`, type: 'warn' },
    ])
  }
}
