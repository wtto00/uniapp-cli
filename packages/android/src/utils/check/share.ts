import { Log, type ManifestConfig } from '@wtto00/uniapp-common'

export function checkShare(manifest: ManifestConfig) {
  const Share = manifest['app-plus']?.modules?.Share
  if (!Share) return true

  const share = manifest['app-plus']?.distribute?.sdkConfigs?.share

  const errors: string[] = []

  if (share?.weixin) {
    if (!share.weixin.appid) {
      errors.push(
        '您配置了微信分享，请在文件manifest.json中配置微信分享的Appid: app-plus.distribute.sdkConfigs.share.weixin.appid',
      )
    }
  }
  if (share?.qq) {
    if (!share.qq.appid) {
      errors.push(
        '您配置了QQ分享，请在文件manifest.json中配置QQ分享的Appid: app-plus.distribute.sdkConfigs.share.qq.appid',
      )
    }
  }
  if (share?.sina) {
    if (!share.sina.appkey) {
      errors.push(
        '您配置了新浪微博分享，请在文件manifest.json中配置新浪微博分享的AppKey: app-plus.distribute.sdkConfigs.share.sina.appkey',
      )
    }
    if (!share.sina.redirect_uri) {
      errors.push(
        '您配置了新浪微博分享，请在文件manifest.json中配置新浪微博分享的回调页地址: app-plus.distribute.sdkConfigs.share.sina.redirect_uri',
      )
    }
  }
  if (!errors.length) return true

  for (const message of errors) {
    Log.warn(message)
  }
  return false
}
