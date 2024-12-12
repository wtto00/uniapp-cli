import type { BuildOptions } from '../build.js'
import type { RunOptions } from '../run.js'
import { NotImplemented, PlatformModule } from './index.js'

export class PlatformMPToutiao extends PlatformModule {
  modules = ['@dcloudio/uni-mp-toutiao']

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
