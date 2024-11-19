import { App } from '../utils/app.js'
import { type ModuleClass, installModules, uninstallModules } from './index.js'

const mpXHS: ModuleClass = {
  modules: ['@dcloudio/uni-mp-xhs'],

  async requirement() {},

  async platformAdd() {
    const uniVersion = App.getUniVersion()
    await installModules(mpXHS.modules, uniVersion)
  },

  async platformRemove() {
    await uninstallModules(mpXHS.modules)
  },

  run() {},

  build() {},
}

export default mpXHS
