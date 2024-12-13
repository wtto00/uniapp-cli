import type { BuildOptions } from '../build.js'
import type { RunOptions } from '../run.js'
import { exists } from '../utils/file.js'
import { HarmonyDir } from '../utils/path.js'
import { PlatformModule } from './index.js'

export class PlatformHarmony extends PlatformModule {
  modules = ['@dcloudio/uni-app-harmony', '@dcloudio/uni-uts-v1']

  async isInstalled() {
    return (await super.isInstalled()) && (await exists(HarmonyDir))
  }

  async requirement() {
    return Promise.reject(Error('暂未实现'))
  }

  async add() {
    return Promise.reject(Error('暂未实现'))
  }

  async remove() {
    return Promise.reject(Error('暂未实现'))
  }

  async run(_options: RunOptions) {
    return Promise.reject(Error('暂未实现'))
  }

  async build(_options: BuildOptions) {
    return Promise.reject(Error('暂未实现'))
  }
}
