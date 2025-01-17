import { Log, type ManifestConfig } from '@wtto00/uniapp-common'
import { checkSignEnv } from '../sign.js'
import { checkAd } from './ad.js'
import { checkGeolocation } from './geolocation.js'
import { checkMaps } from './maps.js'
import { checkNativePlugins } from './native-plugins.js'
import { checkOauth } from './oauth.js'
import { checkPayment } from './payment.js'
import { checkPush } from './push.js'
import { checkShare } from './share.js'
import { checkSpeech } from './speech.js'
import { checkStatistic } from './statics.js'

export function checkConfig(manifest: ManifestConfig) {
  let failed = false

  // name
  if (!manifest.name) {
    failed = true
    Log.warn('请在文件manifest.json中配置应用名称: name')
  }
  // appid
  if (!manifest.appid) {
    failed = true
    Log.warn('请在文件manifest.json中配置应用appid: appid')
  }
  // versionName
  if (!manifest.versionName) {
    failed = true
    Log.warn('请在文件manifest.json中配置应用版本号: versionName')
  }
  // versionCode
  if (!manifest.versionCode) {
    failed = true
    Log.warn('请在文件manifest.json中配置应用版本码: versionCode')
  }
  // dcloud_appkey
  if (!manifest['app-plus']?.distribute?.android?.dcloud_appkey) {
    failed = true
    Log.warn('请在文件manifest.json中配置应用Appkey: app-plus.distribute.android.dcloud_appkey')
  }
  // packagename
  if (!manifest['app-plus']?.distribute?.android?.packagename) {
    failed = true
    Log.warn('请在文件manifest.json中配置应用包名: app-plus.distribute.android.packagename')
  }
  if (!manifest['app-plus']?.distribute?.android?.abiFilters?.length) {
    failed = true
    Log.warn('请在文件manifest.json中配置应用所支持的CPU类型: app-plus.distribute.android.abiFilters')
  }

  // android sign config
  if (!checkSignEnv()) failed = true

  // OAuth
  if (!checkOauth(manifest)) failed = true
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
  if (!checkSpeech(manifest)) failed = true

  // Share
  if (!checkShare(manifest)) failed = true
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
  if (!checkPayment(manifest)) failed = true
  const Payment = manifest['app-plus']?.modules?.Payment
  const payment = manifest['app-plus']?.distribute?.sdkConfigs?.payment
  const paymentWeixinAppid = Payment ? payment?.weixin?.appid : ''
  const paymentWeixinLink = Payment ? payment?.weixin?.UniversalLinks : ''

  // Geolocation
  if (!checkGeolocation(manifest)) failed = true
  const Geolocation = manifest['app-plus']?.modules?.Geolocation
  const geolocation = manifest['app-plus']?.distribute?.sdkConfigs?.geolocation
  const geolocationBaiduAppKey = Geolocation ? geolocation?.baidu?.appkey_android : ''

  // Statistic
  if (!checkStatistic(manifest)) failed = true
  const Statistic = manifest['app-plus']?.modules?.Statistic
  const statics = manifest['app-plus']?.distribute?.sdkConfigs?.statics
  const staticsGoogleServices = Statistic ? statics?.google?.config_android : ''

  // Maps
  if (!checkMaps(manifest)) failed = true
  const Maps = manifest['app-plus']?.modules?.Maps
  const maps = manifest['app-plus']?.distribute?.sdkConfigs?.maps
  const mapsBaiduAppKey = Maps ? maps?.baidu?.appkey_android : ''

  // Push
  if (!checkPush(manifest)) failed = true
  const Push = manifest['app-plus']?.modules?.Push
  const push = manifest['app-plus']?.distribute?.sdkConfigs?.push
  const pushGoogleServices = Push ? push?.unipush?.fcm?.config_android : ''

  // ad
  if (!checkAd(manifest)) failed = true

  // 微信SDK的appid应保持一致
  if (oauthWeixinAppid && shareWeixinAppid && oauthWeixinAppid !== shareWeixinAppid) {
    failed = true
    Log.warn(
      '微信登陆和微信分享的Appid需要配置一致，请在文件manifest.json中检查配置: app-plus.distribute.sdkConfigs.oauth.weixin.appid, app-plus.distribute.sdkConfigs.share.weixin.appid',
    )
  }
  if (shareWeixinAppid && paymentWeixinAppid && shareWeixinAppid !== paymentWeixinAppid) {
    failed = true
    Log.warn(
      '微信分享和微信支付的Appid需要配置一致，请在文件manifest.json中检查配置: app-plus.distribute.sdkConfigs.share.weixin.appid, app-plus.distribute.sdkConfigs.payment.weixin.appid',
    )
  }
  if (oauthWeixinAppid && paymentWeixinAppid && oauthWeixinAppid !== paymentWeixinAppid) {
    failed = true
    Log.warn(
      '微信登陆和微信支付的Appid需要配置一致，请在文件manifest.json中检查配置: app-plus.distribute.sdkConfigs.oauth.weixin.appid, app-plus.distribute.sdkConfigs.payment.weixin.appid',
    )
  }
  // 微信SDK的通用链接应保持一致
  if (oauthWeixinLink && shareWeixinLink && oauthWeixinLink !== shareWeixinLink) {
    failed = true
    Log.warn(
      '微信登陆和微信分享的iOS平台通用链接需要配置一致，请在文件manifest.json中检查配置: app-plus.distribute.sdkConfigs.oauth.weixin.UniversalLinks, app-plus.distribute.sdkConfigs.share.weixin.UniversalLinks',
    )
  }
  if (shareWeixinLink && paymentWeixinLink && shareWeixinLink !== paymentWeixinLink) {
    failed = true
    Log.warn(
      '微信分享和微信支付的iOS平台通用链接需要配置一致，请在文件manifest.json中检查配置: app-plus.distribute.sdkConfigs.share.weixin.UniversalLinks, app-plus.distribute.sdkConfigs.payment.weixin.UniversalLinks',
    )
  }
  if (oauthWeixinLink && paymentWeixinLink && oauthWeixinLink !== paymentWeixinLink) {
    failed = true
    Log.warn(
      '微信登陆和微信支付的iOS平台通用链接需要配置一致，请在文件manifest.json中检查配置: app-plus.distribute.sdkConfigs.oauth.weixin.UniversalLinks, app-plus.distribute.sdkConfigs.payment.weixin.UniversalLinks',
    )
  }

  // QQ登录和QQ分享的appid应保持一致
  if (oauthQQAppid && shareQQAppid && oauthQQAppid !== shareQQAppid) {
    failed = true
    Log.warn(
      'QQ登陆和QQ分享的Appid需要配置一致，请在文件manifest.json中检查配置: app-plus.distribute.sdkConfigs.oauth.qq.appid, app-plus.distribute.sdkConfigs.share.qq.appid',
    )
  }
  // QQ登录和QQ分享的通用链接应保持一致
  if (oauthQQLink && shareQQLink && oauthQQLink !== shareQQLink) {
    failed = true
    Log.warn(
      'QQ登陆和QQ分享的iOS平台通用链接需要配置一致，请在文件manifest.json中检查配置: app-plus.distribute.sdkConfigs.oauth.qq.UniversalLinks, app-plus.distribute.sdkConfigs.share.qq.UniversalLinks',
    )
  }

  // 微博登录和微博分享的appkey和redirect_uri和通用链接应保持一致
  if (oauthSinaAppKey && shareSinaAppKey && oauthSinaAppKey !== shareSinaAppKey) {
    failed = true
    Log.warn(
      '新浪微博登陆和新浪微博分享的AppKey需要配置一致，请在文件manifest.json中检查配置: app-plus.distribute.sdkConfigs.oauth.sina.appkey, app-plus.distribute.sdkConfigs.share.sina.appkey',
    )
  }
  if (oauthSinaRedirectUri && shareSinaRedirectUri && oauthSinaRedirectUri !== shareSinaRedirectUri) {
    failed = true
    Log.warn(
      '新浪微博登陆和新浪微博分享的回调页地址需要配置一致，请在文件manifest.json中检查配置: app-plus.distribute.sdkConfigs.oauth.sina.redirect_uri, app-plus.distribute.sdkConfigs.share.sina.redirect_uri',
    )
  }
  if (oauthSinaLink && shareSinaLink && oauthSinaLink !== shareSinaLink) {
    failed = true
    Log.warn(
      '新浪微博登陆和新浪微博分享的iOS平台通用链接需要配置一致，请在文件manifest.json中检查配置: app-plus.distribute.sdkConfigs.oauth.sina.UniversalLinks, app-plus.distribute.sdkConfigs.share.sina.UniversalLinks',
    )
  }

  // 百度地图和百度定位appKey应保持一致
  if (geolocationBaiduAppKey && mapsBaiduAppKey && geolocationBaiduAppKey !== mapsBaiduAppKey) {
    failed = true
    Log.warn(
      '百度地图和百度定位的AppKey需要配置一致，请在文件manifest.json中检查配置: app-plus.distribute.sdkConfigs.geolocation.baidu.appkey_android, app-plus.distribute.sdkConfigs.maps.baidu.appkey_android',
    )
  }

  // 高德定位与高德地图SDK集成冲突 需要注意 如果集成地图无须再配置定位
  if (Map && maps?.amap?.name && Geolocation && geolocation?.amap?.name) {
    failed = true
    Log.warn(
      '您已经配置了高德地图，无需再配置高德定位，此两项冲突，请在文件manifest.json中删除配置项: app-plus.distribute.sdkConfigs.geolocation.amap',
    )
  }

  // google-services文件路径需要保持一致
  if (staticsGoogleServices && pushGoogleServices && staticsGoogleServices !== pushGoogleServices) {
    failed = true
    Log.warn(
      '谷歌统计和谷歌推送的google-services.json文件位置需要配置一致，请在文件manifest.json中检查配置: app-plus.distribute.sdkConfigs.push.unipush.fcm.config_android, app-plus.distribute.sdkConfigs.statics.google.config_android',
    )
  }

  // 腾讯TBS x5内核不支持“x86”
  const x86 = manifest['app-plus']?.distribute?.android?.abiFilters?.find((item) => item.startsWith('x86'))
  if (manifest['app-plus']?.modules?.['Webview-x5'] && x86) {
    Log.warn('您配置了腾讯TBS x5内核，请注意: 腾讯TBS x5内核不支持“x86”；您无法提交到Google Play商店。')
  }

  if (!checkNativePlugins(manifest)) failed = true

  if (failed) throw Error('一些配置没有检查通过，请完善后重试')
}
