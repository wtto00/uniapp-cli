import { ManifestConfig } from '@uniapp-cli/common'
import { Results } from '../prepare'

export function appendWebviewX5(results: Results, manifest: ManifestConfig) {
  const WebviewX5 = manifest['app-plus']?.modules?.['Webview-x5']
  if (!WebviewX5) return
}
