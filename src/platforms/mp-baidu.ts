import { App } from '../utils/app.js'
import { type ModuleClass, installModules, uninstallModules } from './index.js'

const mpBaidu: ModuleClass = {
  modules: ['@dcloudio/uni-mp-baidu'],

  requirement() {},

  async platformAdd() {
    const uniVersion = App.getUniVersion()
    await installModules(mpBaidu.modules, uniVersion)
  },

  async platformRemove() {
    await uninstallModules(mpBaidu.modules)
  },

  run() {},

  build() {},
}

export default mpBaidu
