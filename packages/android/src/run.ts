import { App, type RunOptions, notInstalledMessage } from '@wtto00/uniapp-common'
import { platformIsInstalled } from './platform-list.js'
import { checkConfig } from './utils/check/index.js'
import { initSignEnv } from './utils/sign.js'

export async function run(options: RunOptions) {
  if (!(await platformIsInstalled())) {
    throw Error(notInstalledMessage('android'))
  }

  await initSignEnv(options)

  const manifest = await App.getManifestJson()
  checkConfig(manifest)
}
