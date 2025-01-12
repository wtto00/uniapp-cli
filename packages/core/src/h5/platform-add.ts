import { App, installDependencies } from '@wtto00/uniapp-common'
import { dependencies } from './utils/const.js'

export { platformRemove } from './platform-remove.js'

export async function platformAdd() {
  const uniVersion = await App.getUniVersion()
  await installDependencies(dependencies.map((dependencyName) => `${dependencyName}@${uniVersion}`))
}
