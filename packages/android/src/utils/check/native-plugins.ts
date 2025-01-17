import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { App, AppPlusOS, Log, type ManifestConfig } from '@wtto00/uniapp-common'

export function checkNativePlugins(manifest: ManifestConfig): boolean {
  const nativePlugins = manifest['app-plus']?.nativePlugins
  if (!nativePlugins) return true

  const errors: string[] = []

  for (const pluginName in nativePlugins) {
    const plugin = nativePlugins[pluginName].__plugin_info__
    const platforms = (plugin.platforms ?? '').split(',')
    if (!platforms.includes('Android')) continue
    const pluginPath = resolve(App.projectRoot, 'nativeplugins', pluginName)
    if (!existsSync(pluginPath)) {
      if (plugin.isCloud) {
        errors.push(`离线打包不支持云端原生插件: ${pluginName}。请下载插件到本地的 nativeplugins 目录内`)
        continue
      }
    }
    if (!existsSync(resolve(pluginPath, AppPlusOS.Android))) {
      errors.push(`您配置了原生插件: ${pluginName}，但是在目录 nativeplugins 中没有找到此插件`)
    }
  }

  if (!errors.length) return true

  for (const message of errors) {
    Log.warn(message)
  }
  return false
}
