import { exists, isInstalled } from '@wtto00/uniapp-common'
import { dependencies, projectDir } from './utils/const.js'

export async function platformIsInstalled() {
  for (const dependencyName of dependencies) {
    if (!(await isInstalled(dependencyName))) return false
  }
  return await exists(projectDir)
}

export async function checkInstalled() {
  if (!(await platformIsInstalled())) {
    throw Error('平台 android 还没有安装。 运行 `uniapp platform add android` 添加')
  }
}
