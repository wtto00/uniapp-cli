import { App } from '../../utils/app.js'
import Log from '../../utils/log.js'
import { AppPlusOS } from '../../utils/manifest.config.js'

export function checkOauth(os: AppPlusOS) {
  const manifest = App.getManifestJson()
  const OAuth = manifest['app-plus']?.modules?.OAuth
  if (!OAuth) return true

  const oauth = manifest['app-plus']?.distribute?.sdkConfigs?.oauth

  const errors: string[] = []

  if (oauth?.weixin) {
    if (!oauth.weixin.appid) {
      errors.push(
        '您配置了微信登陆，请在文件manifest.json中配置微信登陆的Appid: app-plus.distribute.sdkConfigs.oauth.weixin.appid',
      )
    }
    if (os === AppPlusOS.iOS) {
      if (!oauth.weixin.UniversalLinks) {
        errors.push(
          '您配置了微信登陆，请在文件manifest.json中配置微信登陆的iOS平台通用链接: app-plus.distribute.sdkConfigs.oauth.weixin.UniversalLinks',
        )
      }
    }
  }
  if (oauth?.qq) {
    if (!oauth.qq.appid) {
      errors.push(
        '您配置了QQ登陆，请在文件manifest.json中配置QQ登陆的Appid: app-plus.distribute.sdkConfigs.oauth.qq.appid',
      )
    }
    if (os === AppPlusOS.iOS) {
      if (!oauth.qq.UniversalLinks) {
        errors.push(
          '您配置了QQ登陆，请在文件manifest.json中配置QQ登陆的iOS平台通用链接: app-plus.distribute.sdkConfigs.oauth.qq.UniversalLinks',
        )
      }
    }
  }
  if (oauth?.sina) {
    if (!oauth.sina.appkey) {
      errors.push(
        '您配置了新浪微博登陆，请在文件manifest.json中配置新浪微博登陆的AppKey: app-plus.distribute.sdkConfigs.oauth.sina.appkey',
      )
    }
    if (!oauth.sina.redirect_uri) {
      errors.push(
        '您配置了新浪微博登陆，请在文件manifest.json中配置新浪微博登陆的回调页地址: app-plus.distribute.sdkConfigs.oauth.sina.redirect_uri',
      )
    }
    if (os === AppPlusOS.iOS) {
      if (!oauth.sina.UniversalLinks) {
        errors.push(
          '您配置了新浪微博登陆，请在文件manifest.json中配置新浪微博登陆的iOS平台通用链接: app-plus.distribute.sdkConfigs.oauth.sina.UniversalLinks',
        )
      }
    }
  }
  if (oauth?.google) {
    if (os === AppPlusOS.iOS && !oauth.google.clientid) {
      errors.push(
        '您配置了Google登陆，请在文件manifest.json中配置Google登陆的iOS平台客户端ID: app-plus.distribute.sdkConfigs.oauth.google.clientid',
      )
    }
  }
  if (oauth?.facebook) {
    if (!oauth.facebook.appid) {
      errors.push(
        '您配置了Facebook登陆，请在文件manifest.json中配置Facebook登陆的应用编号: app-plus.distribute.sdkConfigs.oauth.facebook.appid',
      )
    }
    if (!oauth.facebook.client_token) {
      errors.push(
        '您配置了Facebook登陆，请在文件manifest.json中配置Facebook登陆的client_token: app-plus.distribute.sdkConfigs.oauth.facebook.client_token',
      )
    }
  }
  if (oauth?.univerify) {
    if (!oauth.univerify.appid) {
      errors.push(
        '您配置了一键登陆，请在文件manifest.json中配置一键登陆的Appid: app-plus.distribute.sdkConfigs.oauth.univerify.appid\n请前往https://dev.dcloud.net.cn/一键登录->基础配置->一键登录应用ID获取',
      )
    }
  }

  if (!errors.length) return true

  for (const message of errors) {
    Log.warn(message)
  }
  return false
}
