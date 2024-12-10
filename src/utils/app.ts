import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { type DetectResult, detectSync } from 'package-manager-detector'
import type { PackageJson } from 'pkg-types'
import { readJsonFile } from './file.js'
import Log from './log.js'
import type { ManifestConfig } from './manifest.config.js'
import { getModuleVersion } from './package.js'

export const App = {
  projectRoot: '',

  package: null as PackageJson | null,

  manifest: null as ManifestConfig | null,

  packageManager: null as DetectResult | null,

  uniVersoin: '',

  vueVersion: '',

  init() {
    App.projectRoot = process.cwd()
    const configPath = resolve(App.projectRoot, 'uniapp.config.json')
    if (existsSync(configPath)) {
      const config = readJsonFile<Record<string, unknown>>(configPath, true)
      for (const key in config || {}) {
        if (typeof config[key] === 'object') {
          process.env[key] = JSON.stringify(config[key])
        } else {
          process.env[key] = (config[key] ?? '').toString()
        }
        Log.debug(`设置环境变量 ${key}="${process.env[key]}"`)
      }
    }
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

  getPackageManager(options?: { notWarn?: boolean }): DetectResult {
    if (!App.packageManager) {
      App.packageManager = detectSync()
      if (!App.packageManager && !options?.notWarn) {
        Log.warn('没有检测到已配置的包管理器，请在 package.json 中配置 packageManager 属性')
      }
    }
    return App.packageManager ?? { name: 'npm', agent: 'npm' }
  },

  getUniVersion(): string {
    if (!App.uniVersoin) {
      App.uniVersoin = getModuleVersion('@dcloudio/uni-app')
      if (!App.uniVersoin) throw Error('获取 @dcloudio/uni-app 版本号失败')
    }
    return App.uniVersoin
  },

  getVueVersion(): string {
    if (!App.vueVersion) {
      App.vueVersion = getModuleVersion('vue')
      if (!App.vueVersion) throw Error('获取 vue 版本号失败')
    }
    return App.vueVersion
  },

  isVue3(): boolean {
    return App.getVueVersion().startsWith('3')
  },
}
