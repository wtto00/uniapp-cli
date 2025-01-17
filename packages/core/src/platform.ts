import { Log, type MaybePromise, errorMessage, safeAwait } from '@wtto00/uniapp-common'
import { type PLATFORM, allPlatforms, importPlatform, logInvalidPlatform } from './platforms/index.js'

/**
 * add platforms
 */
export async function add(platforms: PLATFORM[]) {
  for (const platform of platforms) {
    if (!allPlatforms.includes(platform)) {
      logInvalidPlatform(platform)
      continue
    }

    const module = await importPlatform<{
      platformAdd: () => MaybePromise<void>
      platformRemove: () => MaybePromise<void>
    }>({ platform, fileName: 'platform-add', tryInstall: true })

    try {
      await module.platformAdd()
      Log.success(`${platform} 平台已成功添加`)
    } catch (error) {
      Log.error(`${platform} 平台添加失败: ${errorMessage(error)}`)
      await module.platformRemove()
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
      logInvalidPlatform(platform)
      continue
    }
    const [error, module] = await safeAwait(
      importPlatform<{ platformRemove: () => MaybePromise<void> }>({ platform, fileName: 'platform-remove' }),
    )
    if (error) {
      Log.error(error.message)
      continue
    }
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
    const [error, module] = await safeAwait(
      importPlatform<{ platformIsInstalled: () => Promise<boolean> }>({ platform, fileName: 'platform-list' }),
    )
    const space = Array.from(Array(20 - platform.length))
      .map(() => ' ')
      .join('')
    if (error) {
      Log.info([{ message: `${platform}:${space}` }, { message: '未安装', type: 'warn' }])
      continue
    }
    Log.info([
      { message: `${platform}:${space}` },
      (await module.platformIsInstalled())
        ? { message: '已安装', type: 'success' }
        : { message: '未安装', type: 'warn' },
    ])
  }
}
