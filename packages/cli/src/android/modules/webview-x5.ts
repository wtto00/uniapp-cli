import { ManifestConfig } from '@uniapp-cli/common'
import { Results } from '../prepare'
import { appendSet } from '../../utils/util'

export function appendWebviewX5(results: Results, manifest: ManifestConfig) {
  const WebviewX5 = manifest['app-plus']?.modules?.['Webview-x5']
  if (!WebviewX5) return

  appendSet(results.libs, ['webview-x5-release.aar', 'weex_webview-x5-release.aar'])
}
