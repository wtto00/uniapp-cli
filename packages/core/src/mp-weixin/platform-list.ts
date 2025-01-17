import { isInstalled } from '@wtto00/uniapp-common'
import { dependencies } from './utils/const.js'

export async function platformIsInstalled() {
  for (const dependencyName of dependencies) {
    if (!(await isInstalled(dependencyName))) return false
  }
  return true
}
