import { App } from '../utils/app.js'
import { type ModuleClass, installModules, uninstallModules } from './index.js'

const mpAlipay: ModuleClass = {
  modules: ['@dcloudio/uni-mp-alipay'],

  requirement() {},

  async platformAdd() {
    const uniVersion = App.getUniVersion()
    await installModules(mpAlipay.modules, uniVersion)
  },

  async platformRemove() {
    await uninstallModules(mpAlipay.modules)
  },

  run() {},

  build() {},
}

export default mpAlipay
