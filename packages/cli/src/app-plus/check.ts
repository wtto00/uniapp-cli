import { AppPlusOS, type ManifestConfig } from '@uniapp-cli/common'
import { checkOauth } from './modules/oauth'
import { checkSpeech } from './modules/speech'
import { checkShare } from './modules/share'
import { checkPayment } from './modules/payment'
import { checkGeolocation } from './modules/geolocation'
import { checkStatistic } from './modules/statics'
import { checkMaps } from './modules/maps'
import { checkPush } from './modules/push'

export function checkConfig(manifest: ManifestConfig, os = AppPlusOS.Android) {
  if (!manifest) {
    throw Error('文件manifest.json解析失败')
  }
  // name
  if (!manifest.name) {
    throw Error('请在文件manifest.json中配置应用名称: name')
  }
  // appid
  if (!manifest.appid) {
    throw Error('请在文件manifest.json中配置应用appid: appid')
  }
  // versionName
  if (!manifest.versionName) {
    throw Error('请在文件manifest.json中配置应用版本号: versionName')
  }
  // versionCode
  if (!manifest.versionCode) {
    throw Error('请在文件manifest.json中配置应用版本码: versionCode')
  }
  // dcloud_appkey
  if (
    (os === AppPlusOS.Android && !manifest['app-plus']?.distribute?.android?.dcloud_appkey) ||
    (os === AppPlusOS.iOS && !manifest['app-plus']?.distribute?.ios?.dcloud_appkey)
  ) {
    throw Error(`请在文件manifest.json中配置应用Appkey: app-plus.distribute.${os}.dcloud_appkey`)
  }
  // packagename
  if (os === AppPlusOS.Android && !manifest['app-plus']?.distribute?.android?.packagename) {
    throw Error(`请在文件manifest.json中配置应用包名: app-plus.distribute.android.packagename`)
  }
  if (os === AppPlusOS.iOS && !manifest['app-plus']?.distribute?.ios?.appid) {
    throw Error(`请在文件manifest.json中配置应用包名: app-plus.distribute.ios.appid`)
  }
  if (os === AppPlusOS.Android && !manifest['app-plus']?.distribute?.android?.abiFilters?.length) {
    throw Error(`请在文件manifest.json中配置应用所支持的CPU类型: app-plus.distribute.android.abiFilters`)
  }

  // OAuth
  checkOauth(manifest, os)
  const OAuth = manifest['app-plus']?.modules?.OAuth
  const oauth = manifest['app-plus']?.distribute?.sdkConfigs?.oauth
  const oauthWeixinAppid = OAuth ? oauth?.weixin?.appid : ''
  const oauthWeixinLink = OAuth ? oauth?.weixin?.UniversalLinks : ''
  const oauthQQAppid = OAuth ? oauth?.qq?.appid : ''
  const oauthQQLink = OAuth ? oauth?.qq?.UniversalLinks : ''
  const oauthSinaAppKey = OAuth ? oauth?.sina?.appkey : ''
  const oauthSinaRedirectUri = OAuth ? oauth?.sina?.redirect_uri : ''
  const oauthSinaLink = OAuth ? oauth?.sina?.UniversalLinks : ''

  // Speech
  checkSpeech(manifest, os)

  // Share
  checkShare(manifest, os)
  const Share = manifest['app-plus']?.modules?.Share
  const share = manifest['app-plus']?.distribute?.sdkConfigs?.share
  const shareWeixinAppid = Share ? share?.weixin?.appid : ''
  const shareWeixinLink = Share ? share?.weixin?.UniversalLinks : ''
  const shareQQAppid = Share ? share?.qq?.appid : ''
  const shareQQLink = Share ? share?.qq?.UniversalLinks : ''
  const shareSinaAppKey = Share ? share?.sina?.appkey : ''
  const shareSinaRedirectUri = Share ? share?.sina?.redirect_uri : ''
  const shareSinaLink = Share ? share?.qq?.UniversalLinks : ''

  // Payment
  checkPayment(manifest, os)
  const Payment = manifest['app-plus']?.modules?.Payment
  const payment = manifest['app-plus']?.distribute?.sdkConfigs?.payment
  const paymentWeixinAppid = Payment ? payment?.weixin?.appid : ''
  const paymentWeixinLink = Payment ? payment?.weixin?.UniversalLinks : ''

  // Geolocation
  checkGeolocation(manifest, os)
  const Geolocation = manifest['app-plus']?.modules?.Geolocation
  const geolocation = manifest['app-plus']?.distribute?.sdkConfigs?.geolocation
  let geolocationBaiduAppKey = Geolocation
    ? os == AppPlusOS.Android
      ? geolocation?.baidu?.appkey_android
      : geolocation?.baidu?.appkey_ios
    : ''

  // Statistic
  checkStatistic(manifest, os)

  // Maps
  checkMaps(manifest, os)
  const Maps = manifest['app-plus']?.modules?.Maps
  const maps = manifest['app-plus']?.distribute?.sdkConfigs?.maps
  const mapsBaiduAppKey = Maps ? (os == AppPlusOS.Android ? maps?.baidu?.appkey_android : maps?.baidu?.appkey_ios) : ''

  // Push
  checkPush(manifest, os)

  // 微信SDK的appid应保持一致
  if (oauthWeixinAppid && shareWeixinAppid && oauthWeixinAppid !== shareWeixinAppid) {
    throw Error(
      '微信登陆和微信分享的Appid需要配置一致，请在文件manifest.json中检查配置: app-plus.distribute.sdkConfigs.oauth.weixin.appid, app-plus.distribute.sdkConfigs.share.weixin.appid',
    )
  }
  if (shareWeixinAppid && paymentWeixinAppid && shareWeixinAppid !== paymentWeixinAppid) {
    throw Error(
      '微信分享和微信支付的Appid需要配置一致，请在文件manifest.json中检查配置: app-plus.distribute.sdkConfigs.share.weixin.appid, app-plus.distribute.sdkConfigs.payment.weixin.appid',
    )
  }
  if (oauthWeixinAppid && paymentWeixinAppid && oauthWeixinAppid !== paymentWeixinAppid) {
    throw Error(
      '微信登陆和微信支付的Appid需要配置一致，请在文件manifest.json中检查配置: app-plus.distribute.sdkConfigs.oauth.weixin.appid, app-plus.distribute.sdkConfigs.payment.weixin.appid',
    )
  }
  // 微信SDK的通用链接应保持一致
  if (oauthWeixinLink && shareWeixinLink && oauthWeixinLink !== shareWeixinLink) {
    throw Error(
      '微信登陆和微信分享的iOS平台通用链接需要配置一致，请在文件manifest.json中检查配置: app-plus.distribute.sdkConfigs.oauth.weixin.UniversalLinks, app-plus.distribute.sdkConfigs.share.weixin.UniversalLinks',
    )
  }
  if (shareWeixinLink && paymentWeixinLink && shareWeixinLink !== paymentWeixinLink) {
    throw Error(
      '微信分享和微信支付的iOS平台通用链接需要配置一致，请在文件manifest.json中检查配置: app-plus.distribute.sdkConfigs.share.weixin.UniversalLinks, app-plus.distribute.sdkConfigs.payment.weixin.UniversalLinks',
    )
  }
  if (oauthWeixinLink && paymentWeixinLink && oauthWeixinLink !== paymentWeixinLink) {
    throw Error(
      '微信登陆和微信支付的iOS平台通用链接需要配置一致，请在文件manifest.json中检查配置: app-plus.distribute.sdkConfigs.oauth.weixin.UniversalLinks, app-plus.distribute.sdkConfigs.payment.weixin.UniversalLinks',
    )
  }

  // QQ登录和QQ分享的appid应保持一致
  if (oauthQQAppid && shareQQAppid && oauthQQAppid !== shareQQAppid) {
    throw Error(
      'QQ登陆和QQ分享的Appid需要配置一致，请在文件manifest.json中检查配置: app-plus.distribute.sdkConfigs.oauth.qq.appid, app-plus.distribute.sdkConfigs.share.qq.appid',
    )
  }
  // QQ登录和QQ分享的通用链接应保持一致
  if (oauthQQLink && shareQQLink && oauthQQLink !== shareQQLink) {
    throw Error(
      'QQ登陆和QQ分享的iOS平台通用链接需要配置一致，请在文件manifest.json中检查配置: app-plus.distribute.sdkConfigs.oauth.qq.UniversalLinks, app-plus.distribute.sdkConfigs.share.qq.UniversalLinks',
    )
  }

  // 微博登录和微博分享的appkey和redirect_uri和通用链接应保持一致
  if (oauthSinaAppKey && shareSinaAppKey && oauthSinaAppKey !== shareSinaAppKey) {
    throw Error(
      '新浪微博登陆和新浪微博分享的AppKey需要配置一致，请在文件manifest.json中检查配置: app-plus.distribute.sdkConfigs.oauth.sina.appkey, app-plus.distribute.sdkConfigs.share.sina.appkey',
    )
  }
  if (oauthSinaRedirectUri && shareSinaRedirectUri && oauthSinaRedirectUri !== shareSinaRedirectUri) {
    throw Error(
      '新浪微博登陆和新浪微博分享的回调页地址需要配置一致，请在文件manifest.json中检查配置: app-plus.distribute.sdkConfigs.oauth.sina.redirect_uri, app-plus.distribute.sdkConfigs.share.sina.redirect_uri',
    )
  }
  if (oauthSinaLink && shareSinaLink && oauthSinaLink !== shareSinaLink) {
    throw Error(
      '新浪微博登陆和新浪微博分享的iOS平台通用链接需要配置一致，请在文件manifest.json中检查配置: app-plus.distribute.sdkConfigs.oauth.sina.UniversalLinks, app-plus.distribute.sdkConfigs.share.sina.UniversalLinks',
    )
  }

  // 百度地图和百度定位appKey应保持一致
  if (geolocationBaiduAppKey && mapsBaiduAppKey && geolocationBaiduAppKey !== mapsBaiduAppKey) {
    const fieldName = os === AppPlusOS.Android ? 'appkey_android' : 'appkey_ios'
    throw Error(
      `百度地图和百度定位的AppKey需要配置一致，请在文件manifest.json中检查配置: app-plus.distribute.sdkConfigs.geolocation.baidu.${fieldName}, app-plus.distribute.sdkConfigs.maps.baidu.${fieldName}`,
    )
  }

  // 高德定位与高德地图SDK集成冲突 需要注意 如果集成地图无须再配置定位
  if (Map && maps?.amap?.name && Geolocation && geolocation?.amap?.name) {
    throw Error(
      '您已经配置了高德地图，无需再配置高德定位，此两项冲突，请在文件manifest.json中删除配置项: app-plus.distribute.sdkConfigs.geolocation.amap',
    )
  }
}
