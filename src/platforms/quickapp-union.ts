import type { BuildOptions } from '../build.js'
import type { RunOptions } from '../run.js'
import Log from '../utils/log.js'
import { NotImplemented, PlatformModule } from './index.js'

export class PlatformQuickappWebview extends PlatformModule {
  modules = ['@dcloudio/uni-quickapp-webview']

  async requirement() {
    return NotImplemented
  }

  async remove() {
    Log.warn('移除通用快应用，将同时移除华为快应用')
    await super.remove()
  }

  async run(_options: RunOptions) {
    return NotImplemented
  }

  async build(_options: BuildOptions) {
    return NotImplemented
  }
}
