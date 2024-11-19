import { existsSync } from 'node:fs'
import type { BuildOptions } from '../build.js'
import { App } from '../utils/app.js'
import { HarmonyDir } from '../utils/path.js'
import { type ModuleClass, installModules, uninstallModules } from './index.js'

const harmony: ModuleClass = {
  modules: ['@dcloudio/uni-app-harmony'],

  isInstalled() {
    return existsSync(HarmonyDir)
  },

  requirement() {},

  async platformAdd() {
    const uniVersion = App.getUniVersion()
    await installModules(harmony.modules, uniVersion)
  },

  async platformRemove() {
    await uninstallModules(harmony.modules)
  },

  run(_options: BuildOptions) {},

  build(_options: BuildOptions) {},
}

export default harmony
