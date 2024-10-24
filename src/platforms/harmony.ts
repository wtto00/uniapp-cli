import type { BuildOptions } from '../build.js'
import type { CommonOptions, ModuleClass, PlatformAddOptions } from './index.js'

const harmony: ModuleClass = {
  modules: ['@dcloudio/uni-app-harmony'],

  requirement() {},

  async platformAdd(_options: PlatformAddOptions) {},

  async platformRemove(_options: CommonOptions) {},

  run(_options: BuildOptions) {},

  build(_options: BuildOptions) {},
}

export default harmony
