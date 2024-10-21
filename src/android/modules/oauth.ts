import type { Results } from '../prepare'
import { appendActivity, appendMetaData, appendPermissions } from '../templates/AndroidManifest.xml'
import { appendFeature } from '../templates/dcloud_properties.xml'
import { appendDependencies } from '../templates/app-build.gradle'
import { generateWXEntryActivity, getWXEntryActivityFilePath } from '../templates/WXEntryActivity.java'
import { appendMerge } from '../../utils/util'
import { ManifestConfig } from '../../utils/manifest.config'

export function appendOauth(results: Results, manifest: ManifestConfig) {
  const OAuth = manifest['app-plus']?.modules?.OAuth
  if (!OAuth) return

  const oauth = manifest['app-plus']?.distribute?.sdkConfigs?.oauth

  if (oauth?.facebook) {
    results.libs.add('oauth-facebook-release.aar')

    if (oauth.facebook.permission_ad_remove) {
      appendPermissions(results.androidManifest, {
        'com.google.android.gms.permission.AD_ID': {
          'tools:node': 'remove',
        },
      })
    }

    results.strings.facebook_app_id = oauth.facebook.appid ?? ''
    results.strings.fb_login_protocol_scheme = `fb${oauth.facebook.appid}`
    results.strings.facebook_client_token = oauth.facebook.client_token ?? ''

    appendFeature(results.properties, {
      name: 'OAuth',
      value: 'io.dcloud.feature.oauth.OAuthFeatureImpl',
      module: {
        'OAuth-Facebook': 'io.dcloud.feature.facebook.FacebookOAuthService',
      },
    })

    appendDependencies(results.appBuildGradle, { 'com.facebook.android:facebook-login:12.0.0': {} })
  }

  if (oauth?.google) {
    results.libs.add('oauth-google-release.aar')

    appendFeature(results.properties, {
      name: 'OAuth',
      value: 'io.dcloud.feature.oauth.OAuthFeatureImpl',
      module: {
        'OAuth-Google': 'io.dcloud.feature.google.GoogleOAuthService',
      },
    })

    results.buildGradle.dependencies.add('com.google.gms:google-services:4.2.0')
    appendDependencies(results.appBuildGradle, { 'com.google.android.gms:play-services-auth:19.2.0': {} })
  }

  if (oauth?.qq) {
    results.libs.add('oauth-qq-release.aar')
    // qq_mta-sdk-1.6.2.jar（3.6.7以下版本需要）
    results.libs.add('open_sdk_3.5.12.2_r97423a8_lite.jar')

    appendPermissions(results.androidManifest, { 'android.permission.MODIFY_AUDIO_SETTINGS': {} })

    appendMetaData(results.androidManifest, { QQ_APPID: { value: oauth.qq.appid } })

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
            data: [{ 'android:scheme': oauth.qq.appid ?? '' }],
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
      name: 'OAuth',
      value: 'io.dcloud.feature.oauth.OAuthFeatureImpl',
      module: {
        'OAuth-QQ': 'io.dcloud.feature.oauth.qq.QQOAuthService',
      },
    })
  }

  if (oauth?.sina) {
    results.libs.add('openDefault-12.5.0.aar')
    results.libs.add('oauth-sina-release.aar')

    appendMetaData(results.androidManifest, {
      SINA_REDIRECT_URI: { value: oauth.sina.redirect_uri },
      SINA_APPKEY: { value: oauth.sina.appkey },
    })
    appendActivity(results.androidManifest, {
      'com.sina.weibo.sdk.web.WeiboSdkWebActivity': {
        properties: {
          'android:configChanges': 'keyboardHidden|orientation',
          'android:exported': 'false',
          'android:windowSoftInputMode': 'adjustResize',
        },
      },
    })

    appendFeature(results.properties, {
      name: 'OAuth',
      value: 'io.dcloud.feature.oauth.OAuthFeatureImpl',
      module: {
        'OAuth-Sina': 'io.dcloud.feature.oauth.sina.SinaOAuthService',
      },
    })
  }

  if (oauth?.univerify) {
    // HBuilderX 3.99及以上版本，个推sdk由aar导入改为仓储方式，所以请注意3.99版本的配置与低版本并不相同。
    results.libs.add('oauth-univerify-release.aar')

    appendMerge(results.appBuildGradle, 'manifestPlaceholders', {
      GETUI_APPID: oauth.univerify.appid ?? '',
      GY_APP_ID: oauth.univerify.appid ?? '',
      GT_INSTALL_CHANNEL: 'HBuilder',
    })

    results.buildGradle.allRepositories['https://mvn.getui.com/nexus/content/repositories/releases'] = {}

    appendDependencies(results.appBuildGradle, {
      'com.getui:gtc-dcloud:3.2.16.7': {},
      'com.getui:gysdk:3.1.7.0': { exclude: { group: 'com.getui' } },
    })

    appendFeature(results.properties, {
      name: 'OAuth',
      value: 'io.dcloud.feature.oauth.OAuthFeatureImpl',
      module: {
        'OAuth-IGETui': 'io.dcloud.feature.igetui.GeTuiOAuthService',
      },
    })
  }

  if (oauth?.weixin) {
    // 3.7.6及以上版本，微信SDK改为gradle依赖，需要将libs目录下的wechat-sdk-android-without-mta-X.X.X.aar移除
    results.libs.add('oauth-weixin-release.aar')

    appendDependencies(results.appBuildGradle, { 'com.tencent.mm.opensdk:wechat-sdk-android-without-mta:6.8.0': {} })

    results.filesWrite[getWXEntryActivityFilePath(manifest)] = generateWXEntryActivity(manifest)

    appendPermissions(results.androidManifest, { 'android.permission.MODIFY_AUDIO_SETTINGS': {} })

    appendMetaData(results.androidManifest, { WX_APPID: { value: oauth.weixin.appid } })
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
            data: [{ 'android:scheme': oauth.weixin.appid ?? '' }],
          },
        ],
      },
    })

    appendFeature(results.properties, {
      name: 'OAuth',
      value: 'io.dcloud.feature.oauth.OAuthFeatureImpl',
      module: {
        'OAuth-Weixin': 'io.dcloud.feature.oauth.weixin.WeiXinOAuthService',
      },
    })
  }
  // 小米登录
}
