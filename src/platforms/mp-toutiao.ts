import { App } from '../utils/app.js'
import { type ModuleClass, installModules, uninstallModules } from './index.js'

const mpToutiao: ModuleClass = {
  modules: ['@dcloudio/uni-mp-toutiao'],

  requirement() {},

  async platformAdd() {
    const uniVersion = App.getUniVersion()
    await installModules(mpToutiao.modules, uniVersion)
  },

  async platformRemove() {
    await uninstallModules(mpToutiao.modules)
  },

  run() {},

  build() {},
}

export default mpToutiao
