import { type ModuleClass, installModules, uninstallModules } from './index.js'

const mpQQ: ModuleClass = {
  modules: ['@dcloudio/uni-mp-qq'],

  requirement() {},

  async platformAdd({ version }) {
    await installModules(mpQQ.modules, version)
  },

  async platformRemove() {
    await uninstallModules(mpQQ.modules)
  },

  run() {},

  build() {},
}

export default mpQQ
