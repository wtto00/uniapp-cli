import { type PLATFORM, checkPlatformValid, importPlatform } from './platforms/index.js'
import { Log } from './utils/log.js'
import { getProjectInfo } from './utils/project.js'
import { type MaybePromise, safeAwait } from './utils/util.js'

declare global {
  interface UniRunOptions {
    /**
     * 是否自动打开
     * - h5平台自动打开默认浏览器
     * - 微信小程序平台自动打开微信开发者工具
     * @default true
     */
    open: boolean
    /** 选择打包的 vite 环境模式 */
    mode?: string
    /**
     * Android和iOS平台使用HBuilderX的cli打包运行。
     * @default false
     */
    hxcli?: boolean | string
    /**
     * 运行到指定的设备上。
     * 如果指定了设备名称，那么会运行到指定的设备上，设备未连接会报错。
     * 如果没有指定设备名称，且没有设备在连接中，那么会报错。
     * 如果没有指定设备名称，且仅有一个设备连接中，那么自动运行到连接中的设备。
     * 如果没有指定设备名称，且有多个设备在连接中，会提示用户选择要运行的设备。
     */
    device?: string
    /** Android签名密钥文件所在位置 */
    keystore?: string
    /** Android签名密钥的密码 */
    storepasswd?: string
    /** Android签名密钥别名 */
    alias?: string
    /** Android签名密钥别名的密码 */
    keypasswd?: string
  }
}

export async function run(platform: PLATFORM, options: UniRunOptions) {
  checkPlatformValid(platform)

  const [error, module] = await safeAwait(
    importPlatform<{ run: (projectInfo: ProjectInfo, option: UniRunOptions) => MaybePromise }>({
      platform,
      fileName: 'run',
    }),
  )

  if (error) {
    Log.error(error.message || '出错了')
    return
  }

  const projectInfo = await getProjectInfo()

  await module.run(projectInfo, options)
}
