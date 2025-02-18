import type { ManifestConfig } from '@wtto00/uniapp-common'

export function generateWXEntryActivity(manifest: ManifestConfig) {
  return `package ${manifest['app-plus']?.distribute?.android?.packagename}.wxapi;

import io.dcloud.feature.oauth.weixin.AbsWXCallbackActivity;

	public class WXEntryActivity extends AbsWXCallbackActivity{

}`
}

export function getWXEntryActivityFilePath(manifest: ManifestConfig) {
  return `app/src/main/java/${manifest['app-plus']?.distribute?.android?.packagename
    ?.split('.')
    .join('/')}/wxapi/WXEntryActivity.java`
}
