import { AppPlusOS, type ManifestConfig } from '@uniapp-cli/common'

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
  const { OAuth, Share, Payment, Geolocation, Maps, Statistic } = manifest['app-plus']?.modules || {}
  const { oauth, share, payment, geolocation, maps, statics } = manifest['app-plus']?.distribute?.sdkConfigs || {}

  let oauthWeixinAppid = ''
  let oauthWeixinLink = ''
  let oauthQQAppid = ''
  let oauthQQLink = ''
  let oauthSinaAppKey = ''
  let oauthSinaRedirectUri = ''
  let oauthSinaLink = ''
  if (OAuth) {
    if (oauth?.weixin) {
      oauthWeixinAppid = oauth.weixin.appid ?? ''
      if (!oauthWeixinAppid) {
        throw Error(
          '您配置了微信登陆，请在文件manifest.json中配置微信登陆的Appid: app-plus.distribute.sdkConfigs.oauth.weixin.appid',
        )
      }
      if (os == AppPlusOS.iOS) {
        oauthWeixinLink = oauth.weixin.UniversalLinks ?? ''
        if (!oauthWeixinLink) {
          throw Error(
            '您配置了微信登陆，请在文件manifest.json中配置微信登陆的iOS平台通用链接: app-plus.distribute.sdkConfigs.oauth.weixin.UniversalLinks',
          )
        }
      }
    }
    if (oauth?.qq) {
      oauthQQAppid = oauth.qq.appid ?? ''
      if (!oauthQQAppid) {
        throw Error(
          '您配置了QQ登陆，请在文件manifest.json中配置QQ登陆的Appid: app-plus.distribute.sdkConfigs.oauth.qq.appid',
        )
      }
      if (os == AppPlusOS.iOS) {
        oauthQQLink = oauth.qq.UniversalLinks ?? ''
        if (!oauthQQLink) {
          throw Error(
            '您配置了QQ登陆，请在文件manifest.json中配置QQ登陆的iOS平台通用链接: app-plus.distribute.sdkConfigs.oauth.qq.UniversalLinks',
          )
        }
      }
    }
    if (oauth?.sina) {
      oauthSinaAppKey = oauth.sina.appkey ?? ''
      oauthSinaRedirectUri = oauth.sina.redirect_uri ?? ''
      if (!oauthSinaAppKey) {
        throw Error(
          '您配置了新浪微博登陆，请在文件manifest.json中配置新浪微博登陆的AppKey: app-plus.distribute.sdkConfigs.oauth.sina.appkey',
        )
      }
      if (!oauthSinaRedirectUri) {
        throw Error(
          '您配置了新浪微博登陆，请在文件manifest.json中配置新浪微博登陆的回调页地址: app-plus.distribute.sdkConfigs.oauth.sina.redirect_uri',
        )
      }
      if (os == AppPlusOS.iOS) {
        oauthSinaLink = oauth.sina.UniversalLinks ?? ''
        if (!oauthSinaLink) {
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

  let shareWeixinAppid = ''
  let shareWeixinLink = ''
  let shareQQAppid = ''
  let shareQQLink = ''
  let shareSinaAppKey = ''
  let shareSinaRedirectUri = ''
  let shareSinaLink = ''
  if (Share) {
    if (share?.weixin) {
      shareWeixinAppid = share.weixin.appid ?? ''
      if (!shareWeixinAppid) {
        throw Error(
          '您配置了微信分享，请在文件manifest.json中配置微信分享的Appid: app-plus.distribute.sdkConfigs.share.weixin.appid',
        )
      }
      if (os == AppPlusOS.iOS) {
        shareWeixinLink = share.weixin.UniversalLinks ?? ''
        if (!shareWeixinLink) {
          throw Error(
            '您配置了微信分享，请在文件manifest.json中配置微信分享的iOS平台通用链接: app-plus.distribute.sdkConfigs.share.weixin.UniversalLinks',
          )
        }
      }
    }
    if (share?.qq) {
      shareQQAppid = share.qq.appid ?? ''
      if (!shareQQAppid) {
        throw Error(
          '您配置了QQ分享，请在文件manifest.json中配置QQ分享的Appid: app-plus.distribute.sdkConfigs.share.qq.appid',
        )
      }
      if (os == AppPlusOS.iOS) {
        shareQQLink = share.qq.UniversalLinks ?? ''
        if (!shareQQLink) {
          throw Error(
            '您配置了QQ分享，请在文件manifest.json中配置QQ分享的iOS平台通用链接: app-plus.distribute.sdkConfigs.share.qq.UniversalLinks',
          )
        }
      }
    }
    if (share?.sina) {
      shareSinaAppKey = share.sina.appkey ?? ''
      shareSinaRedirectUri = share.sina.redirect_uri ?? ''
      if (!shareSinaAppKey) {
        throw Error(
          '您配置了新浪微博分享，请在文件manifest.json中配置新浪微博分享的AppKey: app-plus.distribute.sdkConfigs.share.sina.appkey',
        )
      }
      if (!shareSinaRedirectUri) {
        throw Error(
          '您配置了新浪微博分享，请在文件manifest.json中配置新浪微博分享的回调页地址: app-plus.distribute.sdkConfigs.share.sina.redirect_uri',
        )
      }
      if (os == AppPlusOS.iOS) {
        shareSinaLink = share.sina.UniversalLinks ?? ''
        if (!shareSinaLink) {
          throw Error(
            '您配置了新浪微博分享，请在文件manifest.json中配置新浪微博分享的iOS平台通用链接: app-plus.distribute.sdkConfigs.share.sina.UniversalLinks',
          )
        }
      }
    }
  }

  let paymentWeixinAppid = ''
  let paymentWeixinLink = ''
  if (Payment) {
    if (payment?.weixin && payment.weixin.__platform__?.includes(os)) {
      paymentWeixinAppid = payment.weixin.appid ?? ''
      if (!paymentWeixinAppid) {
        throw Error(
          '您配置了微信支付，请在文件manifest.json中配置微信支付的Appid: app-plus.distribute.sdkConfigs.payment.weixin.appid',
        )
      }
      if (os == AppPlusOS.iOS) {
        paymentWeixinLink = payment.weixin.UniversalLinks ?? ''
        if (!paymentWeixinLink) {
          throw Error(
            '您配置了微信支付，请在文件manifest.json中配置微信支付的iOS平台通用链接: app-plus.distribute.sdkConfigs.payment.weixin.UniversalLinks',
          )
        }
      }
    }
    if (payment?.paypal && payment.paypal.__platform__?.includes(os)) {
      if (
        (os === AppPlusOS.Android && !payment.paypal.returnURL_android) ||
        (os === AppPlusOS.iOS && !payment.paypal.returnURL_ios)
      ) {
        throw Error(
          `您配置了Paypal支付，请在文件manifest.json中配置Paypal支付的返回URL地址: app-plus.distribute.sdkConfigs.payment.paypal.${
            os === AppPlusOS.Android ? 'returnURL_android' : 'returnURL_ios'
          }`,
        )
      }
    }
    if (payment?.stripe && payment.stripe.__platform__?.includes(os)) {
      if (os === AppPlusOS.iOS && !payment.stripe.returnURL_ios) {
        throw Error(
          '您配置了Stripe支付，请在文件manifest.json中配置Stripe支付的返回URL地址: app-plus.distribute.sdkConfigs.payment.stripe.returnURL_ios',
        )
      }
    }
  }

  let geolocationBaiduAppKey = ''
  if (Geolocation) {
    if (geolocation?.amap) {
      if (geolocation.amap.__platform__?.includes(os)) {
        if (!geolocation.amap.name) {
          throw Error(
            '您配置了高德定位，请在文件manifest.json中配置高德定位的用户名: app-plus.distribute.sdkConfigs.geolocation.amap.name',
          )
        }
        if (
          (os == AppPlusOS.Android && !geolocation.amap.appkey_android) ||
          (os == AppPlusOS.iOS && !geolocation.amap.appkey_ios)
        ) {
          throw Error(
            `您配置了高德定位，请在文件manifest.json中配置高德定位的AppKey: app-plus.distribute.sdkConfigs.geolocation.amap.${
              os === AppPlusOS.Android ? 'appkey_android' : 'appkey_ios'
            }`,
          )
        }
      }
    }
    if (geolocation?.baidu) {
      if (geolocation.baidu.__platform__?.includes(os)) {
        geolocationBaiduAppKey =
          (os == AppPlusOS.Android ? geolocation.baidu.appkey_android : geolocation.baidu.appkey_ios) ?? ''
        if (
          (os == AppPlusOS.Android && !geolocation.baidu.appkey_android) ||
          (os == AppPlusOS.iOS && !geolocation.baidu.appkey_ios)
        ) {
          throw Error(
            `您配置了百度定位，请在文件manifest.json中配置百度定位的AppKey: app-plus.distribute.sdkConfigs.geolocation.baidu.${
              os === AppPlusOS.Android ? 'appkey_android' : 'appkey_ios'
            }`,
          )
        }
      }
    }
  }

  if (Statistic) {
    if (statics?.umeng) {
      if (
        (os === AppPlusOS.Android && !statics.umeng.appkey_android) ||
        (os === AppPlusOS.iOS && !statics.umeng.appkey_ios)
      ) {
        throw Error(
          `您配置了友盟统计，请在文件manifest.json中配置友盟统计的AppKey: app-plus.distribute.sdkConfigs.statics.umeng.${
            os === AppPlusOS.Android ? 'appkey_android' : 'appkey_ios'
          }`,
        )
      }
      if (
        (os === AppPlusOS.Android && !statics.umeng.channelid_android) ||
        (os === AppPlusOS.iOS && !statics.umeng.channelid_ios)
      ) {
        throw Error(
          `您配置了友盟统计，请在文件manifest.json中配置友盟统计的渠道ID: app-plus.distribute.sdkConfigs.statics.umeng.${
            os === AppPlusOS.Android ? 'channelid_android' : 'channelid_ios'
          }`,
        )
      }
    }
    if (statics?.google) {
      if (
        (os === AppPlusOS.Android && !statics.google.config_android) ||
        (os === AppPlusOS.iOS && !statics.google.config_ios)
      ) {
        throw Error(
          `您配置了Google统计，请在文件manifest.json中配置Google统计的配置文件位置: app-plus.distribute.sdkConfigs.statics.google.${
            os === AppPlusOS.Android ? 'config_android' : 'config_ios'
          }`,
        )
      }
    }
  }

  let mapsBaiduAppKey = ''
  if (Maps) {
    if (maps?.amap) {
      if (!maps.amap.name) {
        throw Error(
          '您配置了高德地图，请在文件manifest.json中配置高德地图的用户名: app-plus.distribute.sdkConfigs.maps.amap.name',
        )
      }
      if ((os == AppPlusOS.Android && !maps.amap.appkey_android) || (os == AppPlusOS.iOS && !maps.amap.appkey_ios)) {
        throw Error(
          `您配置了高德地图，请在文件manifest.json中配置高德地图的AppKey: app-plus.distribute.sdkConfigs.maps.amap.${
            os === AppPlusOS.Android ? 'appkey_android' : 'appkey_ios'
          }`,
        )
      }
    }
    if (maps?.baidu) {
      mapsBaiduAppKey = (os == AppPlusOS.Android ? maps.baidu.appkey_android : maps.baidu.appkey_ios) ?? ''
      if ((os == AppPlusOS.Android && !maps.baidu.appkey_android) || (os == AppPlusOS.iOS && !maps.baidu.appkey_ios)) {
        throw Error(
          `您配置了百度地图，请在文件manifest.json中配置百度地图的AppKey: app-plus.distribute.sdkConfigs.maps.baidu.${
            os === AppPlusOS.Android ? 'appkey_android' : 'appkey_ios'
          }`,
        )
      }
    }
    if (maps?.google) {
      if (
        (os == AppPlusOS.Android && !maps.google.APIKey_android) ||
        (os == AppPlusOS.iOS && !maps.google.APIKey_ios)
      ) {
        throw Error(
          `您配置了Google地图，请在文件manifest.json中配置Google地图的APIKey: app-plus.distribute.sdkConfigs.maps.google.${
            os === AppPlusOS.Android ? 'APIKey_android' : 'APIKey_ios'
          }`,
        )
      }
    }
  }

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
