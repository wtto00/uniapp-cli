import { ManifestConfig } from '../../utils/manifest.config'

export function generateWXPayEntryActivity(manifest: ManifestConfig) {
  return `package ${manifest['app-plus']?.distribute?.android?.packagename}.wxapi;

import io.dcloud.feature.payment.weixin.AbsWXPayCallbackActivity;

public class WXPayEntryActivity extends AbsWXPayCallbackActivity{
	
}`
}

export function getWXPayEntryActivityFilePath(manifest: ManifestConfig) {
  return `app/src/main/java/${manifest['app-plus']?.distribute?.android?.packagename
    ?.split('.')
    .join('/')}/wxapi/WXPayEntryActivity.java`
}
