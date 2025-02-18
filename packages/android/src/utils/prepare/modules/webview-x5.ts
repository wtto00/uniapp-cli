import { App } from '@wtto00/uniapp-common'
import type { Results } from '../results.js'
import { appendSet } from '../xml.js'

export async function appendWebviewX5(results: Results) {
  const manifest = await App.getManifestJson()
  const WebviewX5 = manifest['app-plus']?.modules?.['Webview-x5']
  if (!WebviewX5) return

  appendSet(results.libs, ['webview-x5-release.aar', 'weex_webview-x5-release.aar'])
}
