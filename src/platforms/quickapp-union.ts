import { isInstalled } from '../utils/package.js'
import { type ModuleClass, installModules, uninstallModules } from './index.js'
import quickAppHuawei from './quickapp-huawei.js'

const quickAppUnion: ModuleClass = {
  modules: ['@dcloudio/uni-quickapp-webview'],

  requirement() {},

  async platformAdd({ version }) {
    await installModules(quickAppUnion.modules, version)
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
