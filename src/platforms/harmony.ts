import type { BuildOptions } from '../build.js'
import type { RunOptions } from '../run.js'
import { exists } from '../utils/file.js'
import { HarmonyDir } from '../utils/path.js'
import { NotImplemented, PlatformModule } from './index.js'

export class PlatformHarmony extends PlatformModule {
  modules = ['@dcloudio/uni-app-harmony', '@dcloudio/uni-uts-v1']

  async isInstalled() {
    return (await super.isInstalled()) && (await exists(HarmonyDir))
  }

  async requirement() {
    return NotImplemented
  }

  async add() {
    return NotImplemented
  }

  async remove() {
    return NotImplemented
  }

  async run(_options: RunOptions) {
    return NotImplemented
  }

  async build(_options: BuildOptions) {
    return NotImplemented
  }
}
