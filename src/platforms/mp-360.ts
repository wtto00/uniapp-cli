import { type ModuleClass, PLATFORM, installModules, requireVue2, uninstallModules } from './index.js'

const mp360: ModuleClass = {
  modules: ['@dcloudio/uni-mp-360'],

  async requirement() {
    await requireVue2(PLATFORM.MP_360)
  },

  async platformAdd({ version }) {
    await requireVue2(PLATFORM.MP_360)
    await installModules(mp360.modules, version)
  },

  async platformRemove() {
    await uninstallModules(mp360.modules)
  },

  run() {},

  build() {},
}

export default mp360
