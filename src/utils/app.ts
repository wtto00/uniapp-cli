import { type DetectResult, detectSync } from 'package-manager-detector'
import type { PackageJson } from 'pkg-types'
import { readJsonFile } from './file.js'
import Log from './log.js'
import type { ManifestConfig } from './manifest.config.js'

export const App = {
  projectRoot: '',

  package: null as PackageJson | null,

  manifest: null as ManifestConfig | null,

  packageManager: null as DetectResult | null,

  init() {
    App.projectRoot = process.cwd()
  },

  getPackageJson(): PackageJson {
    if (!App.package) {
      App.package = readJsonFile<PackageJson>('package.json')
    }
    return App.package
  },

  getManifestJson(): ManifestConfig {
    if (!App.manifest) {
      App.manifest = readJsonFile<ManifestConfig>('src/manifest.json', true)
    }
    return App.manifest
  },

  getPackageManager(): DetectResult {
    if (!App.packageManager) {
      App.packageManager = detectSync()
      if (!App.packageManager) {
        Log.warn('没有检测到已配置的包管理器，请在 package.json 中配置 packageManager 属性')
      }
    }
    return App.packageManager ?? { name: 'npm', agent: 'npm' }
  },
}
