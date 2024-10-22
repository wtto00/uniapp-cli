import { AppPlusOS, type ManifestConfig } from '../../utils/manifest.config.js'

export function checkShare(manifest: ManifestConfig, os: AppPlusOS) {
  const Share = manifest['app-plus']?.modules?.Share
  if (!Share) return

  const share = manifest['app-plus']?.distribute?.sdkConfigs?.share

  if (share?.weixin) {
    if (!share.weixin.appid) {
      throw Error(
        '您配置了微信分享，请在文件manifest.json中配置微信分享的Appid: app-plus.distribute.sdkConfigs.share.weixin.appid',
      )
    }
    if (os === AppPlusOS.iOS) {
      if (!share.weixin.UniversalLinks) {
        throw Error(
          '您配置了微信分享，请在文件manifest.json中配置微信分享的iOS平台通用链接: app-plus.distribute.sdkConfigs.share.weixin.UniversalLinks',
        )
      }
    }
  }
  if (share?.qq) {
    if (!share.qq.appid) {
      throw Error(
        '您配置了QQ分享，请在文件manifest.json中配置QQ分享的Appid: app-plus.distribute.sdkConfigs.share.qq.appid',
      )
    }
    if (os === AppPlusOS.iOS) {
      if (!share.qq.UniversalLinks) {
        throw Error(
          '您配置了QQ分享，请在文件manifest.json中配置QQ分享的iOS平台通用链接: app-plus.distribute.sdkConfigs.share.qq.UniversalLinks',
        )
      }
    }
  }
  if (share?.sina) {
    if (!share.sina.appkey) {
      throw Error(
        '您配置了新浪微博分享，请在文件manifest.json中配置新浪微博分享的AppKey: app-plus.distribute.sdkConfigs.share.sina.appkey',
      )
    }
    if (!share.sina.redirect_uri) {
      throw Error(
        '您配置了新浪微博分享，请在文件manifest.json中配置新浪微博分享的回调页地址: app-plus.distribute.sdkConfigs.share.sina.redirect_uri',
      )
    }
    if (os === AppPlusOS.iOS) {
      if (!share.sina.UniversalLinks) {
        throw Error(
          '您配置了新浪微博分享，请在文件manifest.json中配置新浪微博分享的iOS平台通用链接: app-plus.distribute.sdkConfigs.share.sina.UniversalLinks',
        )
      }
    }
  }
}
