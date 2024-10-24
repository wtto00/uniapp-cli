import { installPackages, uninstallPackages } from '../utils/exec.js'
import { Log } from '../utils/log.js'
import { getModuleVersion, isInstalled } from '../utils/package.js'
import type { ModuleClass } from './index.js'

const mpXHS: ModuleClass = {
  modules: ['@dcloudio/uni-mp-xhs'],

  async requirement({ packages }) {
    const vueVersion = await getModuleVersion(packages, 'vue')
    if (vueVersion >= '3') {
      Log.error(`Vue3 currently does not support "mp-360"`)
    }
  },

  async platformAdd({ packages, version }) {
    const vueVersion = await getModuleVersion(packages, 'vue')
    if (vueVersion >= '3') {
      Log.error(`Vue3 currently does not support "mp-xhs"`)
    } else {
      await installPackages(this.modules.map((m) => `${m}@${version}`))
    }
  },

  platformRemove({ packages }) {
    const filterModules = this.modules.filter((module) => isInstalled(packages, module))
    await uninstallPackages(filterModules)
  },

  run() {},

  build() {},
}

export default mpXHS
