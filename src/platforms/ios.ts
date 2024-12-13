import type { BuildOptions } from '../build.js'
import type { RunOptions } from '../run.js'
import { exists } from '../utils/file.js'
import { AndroidDir, IOSDir } from '../utils/path.js'
import { PlatformModule } from './index.js'

export class PlatformIOS extends PlatformModule {
  modules = ['@dcloudio/uni-app-plus', '@dcloudio/uni-uts-v1']

  async isInstalled() {
    return (await super.isInstalled()) && (await exists(IOSDir))
  }

  async requirement() {
    return Promise.reject(Error('暂未实现'))
  }

  async add() {
    await super.add()
    return Promise.reject(Error('暂未实现'))
  }

  async remove() {
    if (!(await exists(AndroidDir))) {
      await super.remove()
    }
    return Promise.reject(Error('暂未实现'))
  }

  async run(_options: RunOptions) {
    return Promise.reject(Error('暂未实现'))
  }

  async build(_options: BuildOptions) {
    return Promise.reject(Error('暂未实现'))
  }
}
