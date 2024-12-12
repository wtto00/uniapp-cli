import type { BuildOptions } from '../build.js'
import type { RunOptions } from '../run.js'
import { NotImplemented, PlatformModule } from './index.js'

export class PlatformMPJD extends PlatformModule {
  modules = ['@dcloudio/uni-mp-jd']

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
