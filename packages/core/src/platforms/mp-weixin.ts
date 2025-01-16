import { BasePlatform, PLATFORM } from './index.js'

export const PlatformH5 = {
  ...BasePlatform,
  name: PLATFORM.MP_WEIXIN,
  dependencies: ['@dcloudio/uni-mp-weixin'],
}
