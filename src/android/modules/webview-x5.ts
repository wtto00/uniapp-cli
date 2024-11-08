import { App } from '../../utils/app.js'
import { appendSet } from '../../utils/util.js'
import type { Results } from '../prepare.js'

export function appendWebviewX5(results: Results) {
  const manifest = App.getManifestJson()
  const WebviewX5 = manifest['app-plus']?.modules?.['Webview-x5']
  if (!WebviewX5) return

  appendSet(results.libs, ['webview-x5-release.aar', 'weex_webview-x5-release.aar'])
}
