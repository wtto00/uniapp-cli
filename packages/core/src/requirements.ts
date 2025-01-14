import { Log, type MaybePromise, errorMessage } from '@wtto00/uniapp-common'
import { type PLATFORM, allPlatforms, importPlatform, logInvalidPlatform } from './platforms/index.js'

export async function requirements(platforms: PLATFORM[]) {
  const invalidPlatforms: string[] = []
  const validPlatforms: PLATFORM[] = platforms.reduce<PLATFORM[]>((prev, platform) => {
    if (allPlatforms.includes(platform)) prev.push(platform)
    else invalidPlatforms.push(platform)
    return prev
  }, [])

  if (invalidPlatforms.length) {
    for (const platform of invalidPlatforms) {
      logInvalidPlatform(platform)
    }
    Log.info()
  }

  for (const platform of validPlatforms) {
    Log.debug(`检查平台 ${platform} 的开发环境要求`)
    Log.info([{ message: `${platform}:`, type: 'cyan' }])

    const module = await importPlatform<{ requirement: () => MaybePromise<void> }>(platform, 'requirement')

    try {
      await module.requirement()
    } catch (error) {
      Log.warn(`出错了: ${errorMessage(error)}`)
    }
    Log.info()
  }
}
