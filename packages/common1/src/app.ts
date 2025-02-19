import { type DetectResult, detect } from 'package-manager-detector'
import type { PackageJson } from 'pkg-types'
import type { UniConfig } from './config.js'
import { readJsonFile } from './file.js'
import { Log } from './log.js'
import type { ManifestConfig } from './manifest.js'
import { getDependencyVersion } from './package.js'
import { safeAwait } from './tool.js'

/**
 * 缓存相关配置
 */
export const App = {
  projectRoot: '',

  _package: null as PackageJson | null,

  _manifest: null as ManifestConfig | null,

  _packageManager: null as DetectResult | null,

  _uniVersoin: '',

  _vueVersion: '',

  _config: null as UniConfig | null,

  async getPackageJson(): Promise<PackageJson> {
    if (!App._package) {
      App._package = await readJsonFile<PackageJson>('package.json')
    }
    return App._package
  },

  async getManifestJson(): Promise<ManifestConfig> {
    if (!App._manifest) {
      App._manifest = await readJsonFile<ManifestConfig>('src/manifest.json')
    }
    return App._manifest
  },

  async getPackageManager(options?: { notWarn?: boolean }): Promise<DetectResult> {
    if (!App._packageManager) {
      App._packageManager = await detect()
      if (!App._packageManager && !options?.notWarn) {
        Log.warn('没有检测到已配置的包管理器，请在 package.json 中配置 packageManager 属性')
      }
    }
    return App._packageManager ?? { name: 'npm', agent: 'npm' }
  },

  async getUniVersion(): Promise<string> {
    if (!App._uniVersoin) {
      App._uniVersoin = await getDependencyVersion('@dcloudio/uni-app')
      if (!App._uniVersoin) throw Error('获取 @dcloudio/uni-app 版本号失败')
    }
    return App._uniVersoin
  },

  async getVueVersion(): Promise<string> {
    if (!App._vueVersion) {
      App._vueVersion = await getDependencyVersion('vue')
      if (!App._vueVersion) throw Error('获取 vue 版本号失败')
    }
    return App._vueVersion
  },

  async isVue3(): Promise<boolean> {
    return (await App.getVueVersion()).startsWith('3')
  },

  async getConfig(): Promise<UniConfig> {
    if (!App._config) {
      ;[, App._config] = await safeAwait(readJsonFile<UniConfig>('.uniapp.json'))
    }
    return App._config ?? {}
  },
}
