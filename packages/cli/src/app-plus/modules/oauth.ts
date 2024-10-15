import { AppPlusOS, type ManifestConfig } from '@uniapp-cli/common'

export function checkOauth(manifest: ManifestConfig, os: AppPlusOS) {
  const OAuth = manifest['app-plus']?.modules?.OAuth
  if (!OAuth) return

  const oauth = manifest['app-plus']?.distribute?.sdkConfigs?.oauth

  if (oauth?.weixin) {
    if (!oauth.weixin.appid) {
      throw Error(
        '您配置了微信登陆，请在文件manifest.json中配置微信登陆的Appid: app-plus.distribute.sdkConfigs.oauth.weixin.appid',
      )
    }
    if (os == AppPlusOS.iOS) {
      if (!oauth.weixin.UniversalLinks) {
        throw Error(
          '您配置了微信登陆，请在文件manifest.json中配置微信登陆的iOS平台通用链接: app-plus.distribute.sdkConfigs.oauth.weixin.UniversalLinks',
        )
      }
    }
  }
  if (oauth?.qq) {
    if (!oauth.qq.appid) {
      throw Error(
        '您配置了QQ登陆，请在文件manifest.json中配置QQ登陆的Appid: app-plus.distribute.sdkConfigs.oauth.qq.appid',
      )
    }
    if (os == AppPlusOS.iOS) {
      if (!oauth.qq.UniversalLinks) {
        throw Error(
          '您配置了QQ登陆，请在文件manifest.json中配置QQ登陆的iOS平台通用链接: app-plus.distribute.sdkConfigs.oauth.qq.UniversalLinks',
        )
      }
    }
  }
  if (oauth?.sina) {
    if (!oauth.sina.appkey) {
      throw Error(
        '您配置了新浪微博登陆，请在文件manifest.json中配置新浪微博登陆的AppKey: app-plus.distribute.sdkConfigs.oauth.sina.appkey',
      )
    }
    if (!oauth.sina.redirect_uri) {
      throw Error(
        '您配置了新浪微博登陆，请在文件manifest.json中配置新浪微博登陆的回调页地址: app-plus.distribute.sdkConfigs.oauth.sina.redirect_uri',
      )
    }
    if (os == AppPlusOS.iOS) {
      if (!oauth.sina.UniversalLinks) {
        throw Error(
          '您配置了新浪微博登陆，请在文件manifest.json中配置新浪微博登陆的iOS平台通用链接: app-plus.distribute.sdkConfigs.oauth.sina.UniversalLinks',
        )
      }
    }
  }
  if (oauth?.google) {
    if (os === AppPlusOS.iOS && !oauth.google.clientid) {
      throw Error(
        '您配置了Google登陆，请在文件manifest.json中配置Google登陆的iOS平台客户端ID: app-plus.distribute.sdkConfigs.oauth.google.clientid',
      )
    }
  }
  if (oauth?.facebook) {
    if (!oauth.facebook.appid) {
      throw Error(
        '您配置了Facebook登陆，请在文件manifest.json中配置Facebook登陆的应用编号: app-plus.distribute.sdkConfigs.oauth.facebook.appid',
      )
    }
    if (!oauth.facebook.client_token) {
      throw Error(
        '您配置了Facebook登陆，请在文件manifest.json中配置Facebook登陆的client_token: app-plus.distribute.sdkConfigs.oauth.facebook.client_token',
      )
    }
  }
  if (oauth?.univerify) {
    if (!oauth.univerify.appid) {
      throw Error(
        '您配置了一键登陆，请在文件manifest.json中配置一键登陆的Appid: app-plus.distribute.sdkConfigs.oauth.univerify.appid\n请前往https://dev.dcloud.net.cn/一键登录->基础配置->一键登录应用ID获取',
      )
    }
  }
}
