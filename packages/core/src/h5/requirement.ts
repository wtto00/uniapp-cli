import { Log } from '@wtto00/uniapp-common'
import { platformIsInstalled } from './platform-list.js'

export async function requirement() {
  if (!(await platformIsInstalled())) {
    Log.warn('平台 h5 还没有安装。请运行 `uniapp platform add h5` 添加安装')
  } else {
    Log.success('平台 h5 已安装')
  }
}
