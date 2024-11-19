import { App } from '../utils/app.js'
import { isInstalled } from '../utils/package.js'
import { type ModuleClass, installModules, uninstallModules } from './index.js'
import quickAppUnion from './quickapp-union.js'

const quickAppHuawei: ModuleClass = {
  modules: ['@dcloudio/uni-quickapp-webview'],

  requirement() {},

  async platformAdd() {
    const uniVersion = App.getUniVersion()
    await installModules(quickAppHuawei.modules, uniVersion)
  },

  async platformRemove() {
    if (!isInstalled(quickAppUnion.modules[0])) {
      await uninstallModules(quickAppHuawei.modules)
    }
  },

  run() {},

  build() {},
}

export default quickAppHuawei
