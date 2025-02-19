import { type PLATFORM, checkPlatformValid, importPlatform } from './platforms/index.js'
import { Log } from './utils/log.js'
import { getProjectInfo } from './utils/project.js'
import { type MaybePromise, safeAwait } from './utils/util.js'

declare global {
  interface UniPublishOptions {
    /** 要发布的版本，不填默认读取manifest中的版本 */
    version?: string
    /** 发布时的备注 */
    desc?: string
    /**
     * 发布前不要打包
     * @default true
     */
    build: boolean
    /**
     * 如果发布前的打包的话，选择打包的 vite 环境模式
     */
    mode?: string
  }
}

export async function publish(platform: PLATFORM, options: UniPublishOptions) {
  checkPlatformValid(platform)

  const [error, module] = await safeAwait(
    importPlatform<{ publish: (projectInfo: ProjectInfo, options: UniPublishOptions) => MaybePromise }>({
      platform,
      fileName: 'publish',
    }),
  )
  if (error) {
    Log.error(error.message || '出错了')
    return
  }

  const projectInfo = await getProjectInfo()

  await module.publish(projectInfo, options)
}
