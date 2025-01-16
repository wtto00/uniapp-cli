import { Log, type MaybePromise, errorMessage, installDependencies, safeAwait } from '@wtto00/uniapp-common'
import { PLATFORM, allPlatforms, importPlatform, logInvalidPlatform } from './platforms/index.js'

/**
 * add platforms
 */
export async function add(platforms: PLATFORM[]) {
  for (const platform of platforms) {
    if (!allPlatforms.includes(platform)) {
      logInvalidPlatform(platform)
      continue
    }

    if (platform === PLATFORM.ANDROID) {
      await installDependencies(['@wtto00/uniapp-android'])
    } else if (platform === PLATFORM.IOS) {
      await installDependencies(['@wtto00/uniapp-ios'])
    } else if (platform === PLATFORM.HARMONY) {
      await installDependencies(['@wtto00/uniapp-harmony'])
    }

    const module = await importPlatform<{
      platformAdd: () => MaybePromise<void>
      platformRemove: () => MaybePromise<void>
    }>(platform, 'platform-add')

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
    const module = await importPlatform<{ platformRemove: () => MaybePromise<void> }>(platform, 'platform-remove')
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
      importPlatform<{ platformIsInstalled: () => Promise<boolean> }>(platform, 'platform-list'),
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
