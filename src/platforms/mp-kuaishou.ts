import type { BuildOptions } from '../build.js'
import type { RunOptions } from '../run.js'
import { NotImplemented, PlatformModule } from './index.js'

export class PlatformMPKuaishou extends PlatformModule {
  modules = ['@dcloudio/uni-mp-kuaishou']

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
