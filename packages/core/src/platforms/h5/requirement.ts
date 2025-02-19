import { platformName } from './const.js'
import { platformIsInstalled } from './platform-list.js'

export async function requirement(projectInfo: ProjectInfo) {
  const {
    Log,
    utils: { platformNotInstalledMessage, platformInstalledMessage },
  } = projectInfo

  if (!(await platformIsInstalled(projectInfo))) {
    Log.warn(platformNotInstalledMessage(platformName))
  } else {
    Log.success(platformInstalledMessage(platformName))
  }
}
