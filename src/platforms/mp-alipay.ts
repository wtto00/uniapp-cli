import { installPackages, uninstallPackages } from '../utils/exec.js'
import { isInstalled } from '../utils/package.js'
import type { ModuleClass } from './index.js'

const mpAlipay: ModuleClass = {
  modules: ['@dcloudio/uni-mp-alipay'],

  requirement() {},

  platformAdd({ version }) {
    await installPackages(this.modules.map((m) => `${m}@${version}`))
  },

  platformRemove({ packages }) {
    const filterModules = this.modules.filter((module) => isInstalled(packages, module))
    await uninstallPackages(filterModules)
  },

  run() {},

  build() {},
}

export default mpAlipay
