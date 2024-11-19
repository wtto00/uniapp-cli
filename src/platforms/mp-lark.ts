import { App } from '../utils/app.js'
import { type ModuleClass, installModules, uninstallModules } from './index.js'

const mpLark: ModuleClass = {
  modules: ['@dcloudio/uni-mp-lark'],

  requirement() {},

  async platformAdd() {
    const uniVersion = App.getUniVersion()
    await installModules(mpLark.modules, uniVersion)
  },

  async platformRemove() {
    await uninstallModules(mpLark.modules)
  },

  run() {},

  build() {},
}

export default mpLark
