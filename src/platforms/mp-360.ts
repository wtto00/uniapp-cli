import { App } from '../utils/app.js'
import { type ModuleClass, installModules, uninstallModules } from './index.js'

const mp360: ModuleClass = {
  modules: ['@dcloudio/uni-mp-360'],

  async requirement() {},

  async platformAdd() {
    const uniVersion = App.getUniVersion()
    await installModules(mp360.modules, uniVersion)
  },

  async platformRemove() {
    await uninstallModules(mp360.modules)
  },

  run() {},

  build() {},
}

export default mp360
