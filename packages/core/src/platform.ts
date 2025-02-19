import { type PLATFORM, allPlatforms, importPlatform, logInvalidPlatform } from './platforms/index.js'
import { errorMessage } from './utils/error.js'
import { Log } from './utils/log.js'
import { getProjectInfo } from './utils/project.js'
import { type MaybePromise, safeAwait } from './utils/util.js'

/**
 * add platforms
 */
export async function add(platforms: PLATFORM[]) {
  const projectInfo = await getProjectInfo()

  for (const platform of platforms) {
    if (!allPlatforms.includes(platform)) {
      logInvalidPlatform(platform)
      continue
    }

    const module = await importPlatform<{
      platformAdd: (projectInfo: ProjectInfo) => MaybePromise<void>
      platformRemove: (projectInfo: ProjectInfo) => MaybePromise<void>
    }>({ platform, fileName: 'platform-add', tryInstall: true })

    try {
      await module.platformAdd(projectInfo)
      Log.success(`${platform} 平台已成功添加`)
    } catch (error) {
      Log.error(`${platform} 平台添加失败: ${errorMessage(error)}`)
      await module.platformRemove(projectInfo)
    }
  }
}

/**
 * remove platforms
 */
export async function remove(platforms: PLATFORM[]) {
  const projectInfo = await getProjectInfo()

  for (const platform of platforms) {
    Log.debug(`移除平台: ${platform}`)
    if (!allPlatforms.includes(platform)) {
      logInvalidPlatform(platform)
      continue
    }
    const [error, module] = await safeAwait(
      importPlatform<{ platformRemove: (projectInfo: ProjectInfo) => MaybePromise<void> }>({
        platform,
        fileName: 'platform-remove',
      }),
    )
    if (error) {
      Log.error(error.message)
      continue
    }
    try {
      await module.platformRemove(projectInfo)
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
  const projectInfo = await getProjectInfo()

  for (const platform of allPlatforms) {
    const [error, module] = await safeAwait(
      importPlatform<{ platformIsInstalled: (projectInfo: ProjectInfo) => Promise<boolean> }>({
        platform,
        fileName: 'platform-list',
      }),
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
      (await module.platformIsInstalled(projectInfo))
        ? { message: '已安装', type: 'success' }
        : { message: '未安装', type: 'warn' },
    ])
  }
}
