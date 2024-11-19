import { App } from '../utils/app.js'
import { type ModuleClass, installModules, uninstallModules } from './index.js'

const mpQQ: ModuleClass = {
  modules: ['@dcloudio/uni-mp-qq'],

  requirement() {},

  async platformAdd() {
    const uniVersion = App.getUniVersion()
    await installModules(mpQQ.modules, uniVersion)
  },

  async platformRemove() {
    await uninstallModules(mpQQ.modules)
  },

  run() {},

  build() {},
}

export default mpQQ
