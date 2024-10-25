import { type ModuleClass, PLATFORM, installModules, requireVue2, uninstallModules } from './index.js'

const mpXHS: ModuleClass = {
  modules: ['@dcloudio/uni-mp-xhs'],

  async requirement() {
    await requireVue2(PLATFORM.MP_XHS)
  },

  async platformAdd({ version }) {
    await requireVue2(PLATFORM.MP_XHS)
    await installModules(mpXHS.modules, version)
  },

  async platformRemove() {
    await uninstallModules(mpXHS.modules)
  },

  run() {},

  build() {},
}

export default mpXHS
