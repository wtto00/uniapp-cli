import { BasePlatform, PLATFORM } from './index.js'

export const PlatformH5 = {
  ...BasePlatform,
  name: PLATFORM.H5,
  dependencies: ['@dcloudio/uni-h5'],
}
