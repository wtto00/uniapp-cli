import { uninstallDependencies } from '@wtto00/uniapp-common'
import { dependencies } from './utils/const.js'

export async function platformRemove() {
  await uninstallDependencies(dependencies)
}
