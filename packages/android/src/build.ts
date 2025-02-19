import { platformIsInstalled } from './platform-list.js'
import { platformName } from './utils/const.js'

export async function build(projectInfo: ProjectInfo, _options: UniBuildOptions) {
  const {
    utils: { platformNotInstalledMessage },
  } = projectInfo

  if (!(await platformIsInstalled(projectInfo))) {
    throw Error(platformNotInstalledMessage(platformName))
  }
}
