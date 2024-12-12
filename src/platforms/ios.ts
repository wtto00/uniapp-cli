import type { BuildOptions } from '../build.js'
import type { RunOptions } from '../run.js'
import { exists } from '../utils/file.js'
import { AndroidDir, IOSDir } from '../utils/path.js'
import { NotImplemented, PlatformModule } from './index.js'

export class PlatformIOS extends PlatformModule {
  modules = ['@dcloudio/uni-app-plus', '@dcloudio/uni-uts-v1']

  async isInstalled() {
    return (await super.isInstalled()) && (await exists(IOSDir))
  }

  async requirement() {
    return NotImplemented
  }

  async add() {
    await super.add()
    return NotImplemented
  }

  async remove() {
    if (!(await exists(AndroidDir))) {
      await super.remove()
    }
    return NotImplemented
  }

  async run(_options: RunOptions) {
    return NotImplemented
  }

  async build(_options: BuildOptions) {
    return NotImplemented
  }
}
