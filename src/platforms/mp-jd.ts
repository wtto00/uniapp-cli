import { type ModuleClass, installModules, uninstallModules } from './index.js'

const mpJD: ModuleClass = {
  modules: ['@dcloudio/uni-mp-jd'],

  requirement() {},

  async platformAdd({ version }) {
    await installModules(mpJD.modules, version)
  },

  async platformRemove() {
    await uninstallModules(mpJD.modules)
  },

  run() {},

  build() {},
}

export default mpJD
