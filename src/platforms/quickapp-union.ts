import { App } from '../utils/app.js'
import { isInstalled } from '../utils/package.js'
import { type ModuleClass, installModules, uninstallModules } from './index.js'
import quickAppHuawei from './quickapp-huawei.js'

const quickAppUnion: ModuleClass = {
  modules: ['@dcloudio/uni-quickapp-webview'],

  requirement() {},

  async platformAdd() {
    const uniVersion = App.getUniVersion()
    await installModules(quickAppUnion.modules, uniVersion)
  },

  async platformRemove() {
    if (!isInstalled(quickAppHuawei.modules[0])) {
      await uninstallModules(quickAppUnion.modules)
    }
  },

  run() {},

  build() {},
}

export default quickAppUnion
