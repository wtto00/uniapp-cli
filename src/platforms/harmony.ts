import { cp, rm } from 'node:fs/promises'
import { join } from 'node:path'
import type { BuildOptions } from '../build.js'
import type { RunOptions } from '../run.js'
import { exists } from '../utils/file.js'
import Log from '../utils/log.js'
import { HarmonyDir, TemplateDir } from '../utils/path.js'
import { PlatformModule } from './index.js'

export default class PlatformHarmony extends PlatformModule {
  static instance = new PlatformHarmony()

  modules = ['@dcloudio/uni-app-harmony', '@dcloudio/uni-uts-v1']

  async isInstalled() {
    return (await super.isInstalled()) && (await exists(HarmonyDir))
  }

  async requirement() {
    // HARMONY_HOME
    if (process.env.HARMONY_HOME) {
      Log.success(`HARMONY_HOME=${process.env.HARMONY_HOME}`)
    } else {
      Log.warn('没有设置环境变量: `HARMONY_HOME`')
    }
  }

  async add() {
    await super.add()

    try {
      await cp(join(TemplateDir, 'harmony'), HarmonyDir, { recursive: true })
    } catch (error) {
      await rm(HarmonyDir, { recursive: true, force: true })
      throw error
    }
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
