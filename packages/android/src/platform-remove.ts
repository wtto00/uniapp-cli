import { rm } from 'node:fs/promises'
import { uninstallDependencies } from '@wtto00/uniapp-common'
import { projectDir } from './utils/const.js'

export async function platformRemove() {
  // Android和iOS共用依赖，所以不能移除依赖
  await rm(projectDir, { recursive: true, force: true })
  await uninstallDependencies(['@wtto00/uniapp-android'])
}
