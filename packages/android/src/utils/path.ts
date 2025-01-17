import { homedir } from 'node:os'
import { resolve } from 'node:path'
import { App } from '@wtto00/uniapp-common'

export async function getSDKDir() {
  const config = await App.getConfig()
  const uniVersion = await App.getUniVersion()
  // 优先本地配置
  if (config.sdkHome) {
    return resolve(config.sdkHome, 'android', uniVersion)
  }
  // 其次环境变量
  if (process.env.UNIAPP_SDK_HOME) {
    return resolve(process.env.UNIAPP_SDK_HOME, 'android', uniVersion)
  }
  return resolve(homedir(), '.uniapp', 'android', uniVersion)
}

export function getTemplateDir() {
  return resolve(import.meta.dirname, '../../template')
}
