import { type ModuleClass, installModules, uninstallModules } from './index.js'

const mpToutiao: ModuleClass = {
  modules: ['@dcloudio/uni-mp-toutiao'],

  requirement() {},

  async platformAdd({ version }) {
    await installModules(mpToutiao.modules, version)
  },

  async platformRemove() {
    await uninstallModules(mpToutiao.modules)
  },

  run() {},

  build() {},
}

export default mpToutiao
