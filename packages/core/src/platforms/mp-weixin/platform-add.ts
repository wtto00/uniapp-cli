import { dependencies } from './const.js'

export { platformRemove } from './platform-remove.js'

export async function platformAdd(projectInfo: ProjectInfo) {
  const {
    uniVersion,
    utils: { installDependencies },
  } = projectInfo

  await installDependencies(dependencies.map((dependencyName) => `${dependencyName}@${uniVersion}`))
}
