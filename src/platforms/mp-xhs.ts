import { type ModuleClass, installModules, uninstallModules } from './index.js'

const mpXHS: ModuleClass = {
  modules: ['@dcloudio/uni-mp-xhs'],

  async requirement() {},

  async platformAdd({ version }) {
    await installModules(mpXHS.modules, version)
  },

  async platformRemove() {
    await uninstallModules(mpXHS.modules)
  },

  run() {},

  build() {},
}

export default mpXHS
