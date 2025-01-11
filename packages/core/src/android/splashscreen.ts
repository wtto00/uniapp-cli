import { existsSync, readdirSync, rmSync } from 'node:fs'
import { extname, join } from 'node:path'
import { App } from '../utils/app.js'
import { AndroidDir } from '../utils/path.js'
import type { Results } from './prepare.js'
import { resourceSizes } from './utils.js'

export function appendSplashScreen(results: Results) {
  const manifest = App.getManifestJson()

  const splashscreen = manifest['app-plus']?.distribute?.splashscreen
  if (splashscreen?.androidStyle !== 'default') {
    // 通用启动界面
    const resourceDir = join(AndroidDir, 'app/src/main/res')
    for (const size of resourceSizes) {
      const sizePath = join(resourceDir, `drawable-${size}`)
      if (!existsSync(sizePath)) continue
      const files = readdirSync(sizePath)
      const splashImage = files.find((file) => file.startsWith('splash.'))
      if (splashImage) {
        rmSync(join(sizePath, splashImage))
      }
    }
    return
  }
  // 自定义启动界面
  if (splashscreen.android) {
    for (const size of resourceSizes) {
      if (splashscreen.android[size]) {
        const splashPath = join(
          AndroidDir,
          'app/src/main/res',
          `drawable-${size}`,
          `splash${extname(splashscreen.android[size])}`,
        )
        results.filesCopy[splashPath] = join(App.projectRoot, 'src', splashscreen.android[size])
      }
    }
  }
}
