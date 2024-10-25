import { type ModuleClass, installModules, uninstallModules } from './index.js'

const mpLark: ModuleClass = {
  modules: ['@dcloudio/uni-mp-lark'],

  requirement() {},

  async platformAdd({ version }) {
    await installModules(mpLark.modules, version)
  },

  async platformRemove() {
    await uninstallModules(mpLark.modules)
  },

  run() {},

  build() {},
}

export default mpLark
