import { join } from 'node:path'
import { App } from '../utils/app.js'
import { readJsonFile } from '../utils/file.js'
import Log from '../utils/log.js'
import type { NativePluginPackage } from '../utils/native-plugin.js'
import { AndroidDir } from '../utils/path.js'
import type { Results } from './prepare.js'
import type { UniPlugin } from './templates/dcloud_uniplugins.json.js'
import { LibsPath } from './templates/libs.js'

export function appendPlugins(results: Results) {
  const manifest = App.getManifestJson()
  const { nativePlugins } = manifest['app-plus'] || {}

  if (!nativePlugins) return
  for (const pluginName in nativePlugins) {
    const plugin = nativePlugins[pluginName].__plugin_info__
    const platforms = (plugin.platforms ?? '').split(',')
    if (!platforms.includes('Android')) continue
    const pluginPath = join(App.projectRoot, 'nativeplugins', pluginName)
    const packageJsonPath = join(pluginPath, 'package.json')
    const packageJson = readJsonFile<NativePluginPackage>(packageJsonPath)
    const pluginInfo = packageJson._dp_nativeplugin?.android
    if (!pluginInfo) {
      Log.warn(`原生插件 ${pluginName} 没有找到 android 节点`)
      continue
    }
    results.plugins.push({
      hooksClass: pluginInfo.hooksClass ?? '',
      plugins: (pluginInfo.plugins ?? []).filter((item) => item.type && item.name && item.class) as UniPlugin[],
    })
    results.filesCopy[join(AndroidDir, LibsPath)] = join(pluginPath, 'android')
  }
}
