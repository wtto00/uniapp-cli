import { App } from '../utils/app.js'
import { type ModuleClass, installModules, uninstallModules } from './index.js'

const mpJD: ModuleClass = {
  modules: ['@dcloudio/uni-mp-jd'],

  requirement() {},

  async platformAdd() {
    const uniVersion = App.getUniVersion()
    await installModules(mpJD.modules, uniVersion)
  },

  async platformRemove() {
    await uninstallModules(mpJD.modules)
  },

  run() {},

  build() {},
}

export default mpJD
