import { App } from '../../utils/app.js'
import { appendSet } from '../../utils/util.js'
import type { Results } from '../prepare.js'
import { appendActivity, appendMetaData, appendPermissions } from '../templates/AndroidManifest.xml.js'
import { appendDependencies } from '../templates/app-build.gradle.js'
import { appendFeature } from '../templates/dcloud_properties.xml.js'
import { findLibSDK } from '../utils.js'

export function appendShare(results: Results) {
  const manifest = App.getManifestJson()
  const Share = manifest['app-plus']?.modules?.Share
  if (!Share) return
  const share = manifest['app-plus']?.distribute?.sdkConfigs?.share

  const sdkVersion = App.getUniVersion()

  if (share?.weixin) {
    // 3.7.6及以上版本，微信SDK改为gradle依赖，需要将libs目录下的wechat-sdk-android-without-mta-X.X.X.aar移除
    appendSet(results.libs, ['share-weixin-release.aar'])

    appendDependencies(results.appBuildGradle, {
      'com.tencent.mm.opensdk:wechat-sdk-android-without-mta:6.8.0': {},
    })

    appendPermissions(results.androidManifest, {
      'android.permission.MODIFY_AUDIO_SETTINGS': {},
    })

    appendMetaData(results.androidManifest, {
      WX_APPID: { value: share.weixin.appid },
    })

    appendActivity(results.androidManifest, {
      [`${manifest['app-plus']?.distribute?.android?.packagename}.wxapi.WXEntryActivity`]: {
        properties: {
          'android:label': '@string/app_name',
          'android:exported': 'true',
          'android:launchMode': 'singleTop',
        },
        intentFilter: [
          {
            action: new Set(['android.intent.action.VIEW']),
            category: new Set(['android.intent.category.DEFAULT']),
            data: [{ 'android:scheme': share.weixin.appid ?? '' }],
          },
        ],
      },
    })

    appendFeature(results.properties, {
      name: 'Share',
      value: 'io.dcloud.share.ShareFeatureImpl',
      module: {
        Weixin: 'io.dcloud.share.mm.WeiXinApiManager',
      },
    })
  }

  if (share?.qq) {
    results.libs.add('share-qq-release.aar')
    const qqOpenSdk = findLibSDK('open_sdk_', sdkVersion)
    if (qqOpenSdk) results.libs.add(qqOpenSdk)

    appendPermissions(results.androidManifest, {
      'android.permission.MODIFY_AUDIO_SETTINGS': {},
    })

    appendMetaData(results.androidManifest, {
      QQ_APPID: { value: share.qq.appid },
    })

    appendActivity(results.androidManifest, {
      'com.tencent.tauth.AuthActivity': {
        properties: {
          'android:launchMode': 'singleTask',
          'android:noHistory': 'true',
        },
        intentFilter: [
          {
            action: new Set(['android.intent.action.VIEW']),
            category: new Set(['android.intent.category.DEFAULT', 'android.intent.category.BROWSABLE']),
            data: [{ 'android:scheme': share.qq.appid ?? '' }],
          },
        ],
      },
      'com.tencent.connect.common.AssistActivity': {
        properties: {
          'android:theme': '@android:style/Theme.Translucent.NoTitleBar',
          'android:screenOrientation': 'portrait',
        },
      },
    })

    appendFeature(results.properties, {
      name: 'Share',
      value: 'io.dcloud.share.ShareFeatureImpl',
      module: {
        QQ: 'io.dcloud.share.qq.QQApiManager',
      },
    })
  }

  if (share?.sina) {
    results.libs.add('share-sina-release.aar')
    const sinaOpenSdk = findLibSDK('openDefault-', sdkVersion)
    if (sinaOpenSdk) results.libs.add(sinaOpenSdk)

    appendPermissions(results.androidManifest, {
      'android.permission.CHANGE_WIFI_STATE': {},
      'android.permission.ACCESS_WIFI_STATE': {},
      'android.permission.ACCESS_NETWORK_STATE': {},
    })

    appendMetaData(results.androidManifest, {
      SINA_APPKEY: { value: share.sina.appkey },
      SINA_REDIRECT_URI: { value: share.sina.redirect_uri },
    })

    appendActivity(results.androidManifest, {
      'com.sina.weibo.sdk.web.WeiboSdkWebActivity': {
        properties: {
          'android:configChanges': 'keyboardHidden|orientation',
          'android:exported': 'false',
          'android:windowSoftInputMode': 'adjustResize',
        },
      },
      'com.sina.weibo.sdk.share.WbShareTransActivity': {
        properties: {
          'android:launchMode': 'singleTask',
          'android:theme': '@android:style/Theme.Translucent.NoTitleBar.Fullscreen',
        },
        intentFilter: [
          {
            action: new Set(['com.sina.weibo.sdk.action.ACTION_SDK_REQ_ACTIVITY']),
            category: new Set(['android.intent.category.DEFAULT']),
          },
        ],
      },
    })

    appendFeature(results.properties, {
      name: 'Share',
      value: 'io.dcloud.share.ShareFeatureImpl',
      module: {
        Sina: 'io.dcloud.share.sina.SinaWeiboApiManager',
      },
    })
  }
}
