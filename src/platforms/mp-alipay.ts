import { type ModuleClass, installModules, uninstallModules } from './index.js'

const mpAlipay: ModuleClass = {
  modules: ['@dcloudio/uni-mp-alipay'],

  requirement() {},

  async platformAdd({ version }) {
    await installModules(mpAlipay.modules, version)
  },

  async platformRemove() {
    await uninstallModules(mpAlipay.modules)
  },

  run() {},

  build() {},
}

export default mpAlipay
