import { isInstalled } from '@wtto00/uniapp-common'
import { dependencies } from './utils/const.js'

export async function platformIsInstalled() {
  for (const dependencyName of dependencies) {
    if (!(await isInstalled(dependencyName))) return false
  }
  return true
}

export async function checkInstalled() {
  if (!(await platformIsInstalled())) {
    throw Error('平台 mp-weixin 还没有安装。 运行 `uniapp platform add mp-weixin` 添加')
  }
}
