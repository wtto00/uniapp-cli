import type { BuildOptions } from '../build.js'
import { type ModuleClass, installModules, uninstallModules } from './index.js'

const harmony: ModuleClass = {
  modules: ['@dcloudio/uni-app-harmony'],

  requirement() {},

  async platformAdd({ version }) {
    await installModules(harmony.modules, version)
  },

  async platformRemove() {
    await uninstallModules(harmony.modules)
  },

  run(_options: BuildOptions) {},

  build(_options: BuildOptions) {},
}

export default harmony
