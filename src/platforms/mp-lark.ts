import { installPackages, uninstallPackages } from '../utils/exec.js'
import { isInstalled } from '../utils/package.js'
import type { ModuleClass } from './index.js'

const mpLark: ModuleClass = {
  modules: ['@dcloudio/uni-mp-lark'],

  requirement() {},

  platformAdd({ version }) {
    installPackages(this.modules.map((m) => `${m}@${version}`))
  },

  platformRemove({ packages }) {
    const filterModules = this.modules.filter((module) => isInstalled(packages, module))
    uninstallPackages(filterModules)
  },

  run() {},

  build() {},
}

export default mpLark
