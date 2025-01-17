import { type BuildOptions, notInstalledMessage } from '@wtto00/uniapp-common'
import { platformIsInstalled } from './platform-list.js'

export async function build(_options: BuildOptions) {
  if (!(await platformIsInstalled())) {
    throw Error(notInstalledMessage('h5'))
  }
}
