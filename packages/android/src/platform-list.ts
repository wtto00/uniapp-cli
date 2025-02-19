import { dependencies, projectDir } from './utils/const.js'

export async function platformIsInstalled(projectInfo: ProjectInfo) {
  const {
    utils: { isDependencyInstalled, exists },
  } = projectInfo

  for (const dependencyName of dependencies) {
    if (!(await isDependencyInstalled(dependencyName))) return false
  }
  return await exists(projectDir)
}
