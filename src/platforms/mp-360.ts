import type { BuildOptions } from '../build.js'
import type { RunOptions } from '../run.js'
import { NotImplemented, PlatformModule } from './index.js'

export class PlatformMP360 extends PlatformModule {
  modules = ['@dcloudio/uni-mp-360']

  async requirement() {
    return NotImplemented
  }

  async run(_options: RunOptions) {
    return NotImplemented
  }

  async build(_options: BuildOptions) {
    return NotImplemented
  }
}
