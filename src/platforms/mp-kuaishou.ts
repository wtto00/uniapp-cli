import { App } from '../utils/app.js'
import { type ModuleClass, installModules, uninstallModules } from './index.js'

const mpKuaishou: ModuleClass = {
  modules: ['@dcloudio/uni-mp-kuaishou'],

  requirement() {},

  async platformAdd() {
    const uniVersion = App.getUniVersion()
    await installModules(mpKuaishou.modules, uniVersion)
  },

  async platformRemove() {
    await uninstallModules(mpKuaishou.modules)
  },

  run() {},

  build() {},
}

export default mpKuaishou
