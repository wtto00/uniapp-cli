import { type ModuleClass, installModules, uninstallModules } from './index.js'

const mpKuaishou: ModuleClass = {
  modules: ['@dcloudio/uni-mp-kuaishou'],

  requirement() {},

  async platformAdd({ version }) {
    await installModules(mpKuaishou.modules, version)
  },

  async platformRemove() {
    await uninstallModules(mpKuaishou.modules)
  },

  run() {},

  build() {},
}

export default mpKuaishou
