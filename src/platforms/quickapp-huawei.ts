import type { BuildOptions } from '../build.js'
import type { RunOptions } from '../run.js'
import Log from '../utils/log.js'
import { PlatformModule } from './index.js'

export default class PlatformQuickappHuawei extends PlatformModule {
  static instance = new PlatformQuickappHuawei()

  modules = ['@dcloudio/uni-quickapp-webview']

  async requirement() {
    return Promise.reject(Error('暂未实现'))
  }

  async remove() {
    Log.warn('移除华为快应用，将同时移除通用快应用')
    await super.remove()
  }

  async run(_options: RunOptions) {
    return Promise.reject(Error('暂未实现'))
  }

  async build(_options: BuildOptions) {
    return Promise.reject(Error('暂未实现'))
  }
}
