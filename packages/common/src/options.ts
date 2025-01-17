export interface PublishOptions {
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
  /**
   * 指定HBuilderX的cli可执行文件位置
   * 如果为true，则使用环境变量HBUILDERX_CLI
   * 如果为false，则不使用HBuilderX的cli
   * 如果为字符串，则使用指定的HBuilderX的cli可执行文件位置
   */
  // hxcli: string | boolean
}

/**
 * 运行和打包共用的选项
 */
interface RunBuildOptions {
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

export interface RunOptions extends RunBuildOptions {}

export interface BuildOptions extends RunBuildOptions {
  /**
   * 打包产物
   * - Android: aab, apk(默认), wgt
   * - Harmony: hap(默认), app
   */
  bundle?: 'aab' | 'apk' | 'wgt' | 'hap' | 'app'
}
