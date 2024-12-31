import { App } from '../utils/app.js'
import Log from '../utils/log.js'

export function checkConfig() {
  if (!App.isVue3()) {
    throw Error('Harmony平台不支持vue2版本')
  }

  const manifest = App.getManifestJson()

  const { bundleName, modules, icons, splashScreens } = manifest['app-harmony']?.distribute ?? {}

  let failed = false

  if (!bundleName) {
    failed = true
    Log.warn('请在文件manifest.json中配置应用包名: app-harmony.distribute.bundleName')
  }

  // versionName
  if (!manifest.versionName) {
    failed = true
    Log.warn('请在文件manifest.json中配置应用版本号: versionName')
  }
  // versionCode
  if (!manifest.versionCode) {
    failed = true
    Log.warn('请在文件manifest.json中配置应用版本码: versionCode')
  }

  if (!icons?.foreground) {
    Log.warn('没有配置应用图标(app-harmony.distribute.icons.foreground)，将使用默认图标')
  }
  if (!icons?.background) {
    Log.warn('没有配置应用图标背景(app-harmony.distribute.icons.background)，将使用默认图标背景')
  }
  if (!splashScreens?.startWindowIcon) {
    Log.warn(
      `没有配置应用启动屏图标(app-harmony.distribute.splashScreens.startWindowIcon)，将使用${icons?.foreground ? '已配置的应用图标' : '默认图标'}`,
    )
  }
  if (!splashScreens?.startWindowBackground) {
    Log.warn(
      '没有配置应用启动屏背景色(app-harmony.distribute.splashScreens.startWindowBackground)，将使用默认背景色#FFFFFF',
    )
  }

  if (modules?.['uni-map']?.tencent && !modules['uni-map'].tencent.key) {
    failed = true
    Log.warn(
      '您配置了腾讯地图，请在文件manifest.json中配置腾讯地图的key: app-harmony.distribute.modules.uni-map.tencent.key',
    )
  }

  if (failed) throw Error('一些配置没有检查通过，请完善后重试')
}
