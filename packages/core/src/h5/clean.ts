import { rm } from 'node:fs/promises'
import { join } from 'node:path'
import { App } from '@wtto00/uniapp-common'
import { buildDistPath, devDistPath } from './utils/const.js'

export async function clean(option?: { isBuild?: boolean }) {
  if (option?.isBuild === true) {
    await rm(join(App.projectRoot, buildDistPath), { force: true, recursive: true })
  } else if (option?.isBuild === false) {
    await rm(join(App.projectRoot, devDistPath), { force: true, recursive: true })
  } else {
    await clean({ isBuild: true })
    await clean({ isBuild: false })
  }
}
