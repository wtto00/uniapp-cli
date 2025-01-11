import { App } from '../../utils/app.js'
import Log from '../../utils/log.js'
import { AppPlusOS } from '../../utils/manifest.config.js'

export function checkShare(os: AppPlusOS) {
  const manifest = App.getManifestJson()
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
    if (os === AppPlusOS.iOS) {
      if (!share.weixin.UniversalLinks) {
        errors.push(
          '您配置了微信分享，请在文件manifest.json中配置微信分享的iOS平台通用链接: app-plus.distribute.sdkConfigs.share.weixin.UniversalLinks',
        )
      }
    }
  }
  if (share?.qq) {
    if (!share.qq.appid) {
      errors.push(
        '您配置了QQ分享，请在文件manifest.json中配置QQ分享的Appid: app-plus.distribute.sdkConfigs.share.qq.appid',
      )
    }
    if (os === AppPlusOS.iOS) {
      if (!share.qq.UniversalLinks) {
        errors.push(
          '您配置了QQ分享，请在文件manifest.json中配置QQ分享的iOS平台通用链接: app-plus.distribute.sdkConfigs.share.qq.UniversalLinks',
        )
      }
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
    if (os === AppPlusOS.iOS) {
      if (!share.sina.UniversalLinks) {
        errors.push(
          '您配置了新浪微博分享，请在文件manifest.json中配置新浪微博分享的iOS平台通用链接: app-plus.distribute.sdkConfigs.share.sina.UniversalLinks',
        )
      }
    }
  }
  if (!errors.length) return true

  for (const message of errors) {
    Log.warn(message)
  }
  return false
}
