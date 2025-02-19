import { dependencies } from './const.js'

export async function platformRemove(projectInfo: ProjectInfo) {
  const {
    utils: { uninstallDependencies },
  } = projectInfo

  await uninstallDependencies(dependencies)
}
