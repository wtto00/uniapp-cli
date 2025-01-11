import type { BuildOptions } from '../build.js'
import type { RunOptions } from '../run.js'
import { PlatformModule } from './index.js'

export default class PlatformMPKuaishou extends PlatformModule {
  static instance = new PlatformMPKuaishou()

  modules = ['@dcloudio/uni-mp-kuaishou']

  async requirement() {
    return Promise.reject(Error('暂未实现'))
  }

  async run(_options: RunOptions) {
    return Promise.reject(Error('暂未实现'))
  }

  async build(_options: BuildOptions) {
    return Promise.reject(Error('暂未实现'))
  }
}
