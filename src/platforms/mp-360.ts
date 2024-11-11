import { type ModuleClass, installModules, uninstallModules } from './index.js'

const mp360: ModuleClass = {
  modules: ['@dcloudio/uni-mp-360'],

  async requirement() {},

  async platformAdd({ version }) {
    await installModules(mp360.modules, version)
  },

  async platformRemove() {
    await uninstallModules(mp360.modules)
  },

  run() {},

  build() {},
}

export default mp360
