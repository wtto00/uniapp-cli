import { type ModuleClass, installModules, uninstallModules } from './index.js'

const mpBaidu: ModuleClass = {
  modules: ['@dcloudio/uni-mp-baidu'],

  requirement() {},

  async platformAdd({ version }) {
    await installModules(mpBaidu.modules, version)
  },

  async platformRemove() {
    await uninstallModules(mpBaidu.modules)
  },

  run() {},

  build() {},
}

export default mpBaidu
