import { ManifestConfig } from '@uniapp-cli/common'
import { Results } from '../prepare'

export function appendPush(results: Results, manifest: ManifestConfig) {
  const Push = manifest['app-plus']?.modules?.Push
  if (!Push) return

  const push = manifest['app-plus']?.distribute?.sdkConfigs?.push
  // https://uniapp.dcloud.net.cn/unipush-v1.html
  // https://nativesupport.dcloud.net.cn/AppDocs/usemodule/androidModuleConfig/push.html
}
