import { existsSync } from 'node:fs'
import { androidDir } from '../utils/path.js'
import { type ModuleClass, installModules, uninstallModules } from './index.js'

const ios: ModuleClass = {
  modules: ['@dcloudio/uni-app-plus', 'uniapp-ios'],

  requirement() {},

  async platformAdd({ version }) {
    await installModules(ios.modules, version)
  },

  async platformRemove() {
    if (!existsSync(androidDir)) {
      await uninstallModules(ios.modules)
    }
  },

  run() {},

  build() {},
}

export default ios
