/**
 * 本地相关的一些配置项。
 * 文件 `.uniapp.json`
 */
export interface UniConfig {
  /**
   * 离线 SDK 的下载保存的本地目录。
   * @default '~/.uniapp'
   */
  sdkHome?: string
  /** HBuilderX 的 cli 可执行文件所在位置 */
  hxcli?: string
  /**
   * `JDK` 所在的目录位置。
   * 没有配置的话，会自动寻找 `PATH` 环境变量中 `java` 可执行文件的位置。
   */
  javaHome?: string
  android?: {
    /**
     * Android SDK 的目录位置。
     * 没有配置的话，会自动寻找 `PATH` 环境变量中 `adb` 可执行文件的位置。
     */
    androidHome?: string
  }
  'mp-weixin'?: {
    /**
     * 微信开发者工具的 `cli`(`Windows` 上为 `cli.bat`) 可执行文件所在的位置。
     * @default
     * - `Windows` 上为 `C:\\Program Files (x86)\\Tencent\\微信web开发者工具\\cli.bat`
     * - `macOS` 上为 `/Applications/wechatwebdevtools.app/Contents/MacOS/cli`
     */
    devTool?: string
  }
}
