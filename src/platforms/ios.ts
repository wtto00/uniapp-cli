import { existsSync } from 'node:fs'
import { App } from '../utils/app.js'
import { AndroidDir, IOSDir } from '../utils/path.js'
import { type ModuleClass, installModules, uninstallModules } from './index.js'

const ios: ModuleClass = {
  modules: ['@dcloudio/uni-app-plus'],

  isInstalled() {
    return existsSync(IOSDir)
  },

  requirement() {},

  async platformAdd() {
    const uniVersion = App.getUniVersion()
    await installModules(ios.modules, uniVersion)
  },

  async platformRemove() {
    if (!existsSync(AndroidDir)) {
      await uninstallModules(ios.modules)
    }
  },

  run() {},

  build() {},
}

export default ios
