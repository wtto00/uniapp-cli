import { Log, installedMessage, notInstalledMessage } from '@wtto00/uniapp-common'
import { PLATFORM } from '../platforms/index.js'
import { platformIsInstalled } from './platform-list.js'

export async function requirement() {
  if (!(await platformIsInstalled())) {
    Log.warn(notInstalledMessage(PLATFORM.H5))
  } else {
    Log.success(installedMessage(PLATFORM.H5))
  }
}
