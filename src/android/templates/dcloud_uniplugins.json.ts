export interface DcloudUniPlugins {
  nativePlugins: DcloudUniPlugin[]
}
export interface DcloudUniPlugin {
  hooksClass?: string
  plugins: UniPlugin[]
}
export interface UniPlugin {
  type: 'module' | 'component'
  name: string
  class: string
}

export const DcloudUniPluginsFilePath = 'app/src/main/assets/dcloud_uniplugins.json'

export function generateDcloudUniPlugins(plugins: DcloudUniPlugins) {
  return JSON.stringify(plugins)
}
