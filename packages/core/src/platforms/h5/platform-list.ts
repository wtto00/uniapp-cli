import { dependencies } from './const.js'

export async function platformIsInstalled(projectInfo: ProjectInfo) {
  const {
    utils: { isDependencyInstalled },
  } = projectInfo

  for (const dependencyName of dependencies) {
    if (!(await isDependencyInstalled(dependencyName))) return false
  }
  return true
}
