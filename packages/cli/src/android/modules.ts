/**
 * 模块的处理
 */

import type { ManifestConfig } from "@uniapp-cli/common";
import { appendFeature, Properties } from "./templates/dcloud_properties.xml";
import { generateWXEntryActivity, getWXEntryActivityFilePath } from "./templates/WXEntryActivity.java";

export interface ModulesResult {
  /** 模块所需要的权限 */
  permissions: Set<string>;
  /** Androidmainfest.xml中的application节点下配置meta-data等 */
  application: Set<string>;
  /** 所需要的依赖文件 */
  libs: Set<string>;
  /** 要写入的的文件 */
  files: Record<string, string>;
  /** gradle依赖 */
  gradleDependencies: Set<string>;
  /** build.gradle文件中的defaultConfig下的manifestPlaceholders节点 */
  gradleManifestPlaceholders: Record<string, string>;
  gradleApplyPlugin: Set<string>;
  /** build.gradle下添加的仓库地址 */
  rootGradleMaven: Set<string>;
  rootGradleAllMaven: Set<string>;
  rootGradleDependencies: Set<string>;
  activityPandoraEntry: Set<string>;
  properties: Properties;
  /** res/values/strings.xml */
  strings: Set<string>;
}

export function getModulesResults(manifest: ManifestConfig) {
  const {
    OAuth,
    Bluetooth,
    Speech,
    Camera,
    Share,
    Geolocation,
    Push,
    Statistic,
    Barcode,
    FaceID,
    Fingerprint,
    FacialRecognitionVerify,
    iBeacon,
    LivePusher,
    Maps,
    Messaging,
    Payment,
    Record,
    SQLite,
    VideoPlayer,
    "Webview-x5": WebviewX5,
    UIWebview,
  } = manifest["app-plus"]?.modules || {};
  const { oauth, ad, share, geolocation, statics, push, maps, payment } =
    manifest["app-plus"]?.distribute?.sdkConfigs || {};

  const results: ModulesResult = {
    permissions: new Set(),
    /** Androidmainfest.xml中的application节点下配置meta-data等 */
    application: new Set(),
    /** 所需要的依赖文件 */
    libs: new Set(),
    files: {},
    /** gradle依赖 */
    gradleDependencies: new Set(),
    /** build.gradle文件中的defaultConfig下的manifestPlaceholders节点 */
    gradleManifestPlaceholders: {},
    gradleApplyPlugin: new Set(),
    /** build.gradle下添加的仓库地址 */
    rootGradleMaven: new Set(),
    rootGradleAllMaven: new Set(),
    rootGradleDependencies: new Set(),
    activityPandoraEntry: new Set(),
    properties: { features: {}, services: {} },
    strings: new Set(),
  };

  if (OAuth) {
    if (oauth?.facebook) {
      results.libs.add("oauth-facebook-release.aar");

      results.strings.add(`<string name="facebook_app_id">${oauth.facebook.appid}</string>`);
      results.strings.add(`<string name="fb_login_protocol_scheme">fb${oauth.facebook.appid}</string>`);
      results.strings.add(`<string name="facebook_client_token">${oauth.facebook.client_token}</string>`);

      appendFeature(results.properties.features, {
        name: "OAuth",
        value: "io.dcloud.feature.oauth.OAuthFeatureImpl",
        module: {
          "OAuth-Facebook": "io.dcloud.feature.facebook.FacebookOAuthService",
        },
      });

      results.gradleDependencies.add("implementation 'com.facebook.android:facebook-login:12.0.0'");
    }

    if (oauth?.google) {
      results.libs.add("oauth-google-release.aar");

      appendFeature(results.properties.features, {
        name: "OAuth",
        value: "io.dcloud.feature.oauth.OAuthFeatureImpl",
        module: {
          "OAuth-Google": "io.dcloud.feature.google.GoogleOAuthService",
        },
      });

      results.rootGradleDependencies.add("classpath 'com.google.gms:google-services:4.2.0'");
      results.gradleDependencies.add("implementation 'com.google.android.gms:play-services-auth:19.2.0'");
    }

    if (oauth?.qq) {
      results.libs.add("oauth-qq-release.aar");
      // qq_mta-sdk-1.6.2.jar（3.6.7以下版本需要）
      results.libs.add("open_sdk_3.5.12.2_r97423a8_lite.jar");

      results.permissions.add('<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS"/>');

      results.application.add(`<meta-data android:value="${oauth.qq.appid}" android:name="QQ_APPID"/>
        <activity android:name="com.tencent.tauth.AuthActivity" android:launchMode="singleTask" android:noHistory="true">
            <intent-filter>
                <action android:name="android.intent.action.VIEW"/>、
                <category android:name="android.intent.category.DEFAULT"/>
                <category android:name="android.intent.category.BROWSABLE"/>
                <data android:scheme="${oauth.qq.appid}"/>
            </intent-filter>
        </activity>
        <activity android:name="com.tencent.connect.common.AssistActivity" android:theme="@android:style/Theme.Translucent.NoTitleBar" android:screenOrientation="portrait"/>`);

      appendFeature(results.properties.features, {
        name: "OAuth",
        value: "io.dcloud.feature.oauth.OAuthFeatureImpl",
        module: {
          "OAuth-QQ": "io.dcloud.feature.oauth.qq.QQOAuthService",
        },
      });
    }

    if (oauth?.sina) {
      results.libs.add("openDefault-12.5.0.aar");
      results.libs.add("oauth-sina-release.aar");

      results.application.add(`<meta-data android:value="${oauth.sina.redirect_uri}" android:name="SINA_REDIRECT_URI"/>
        <meta-data android:value="${oauth.sina.appkey}" android:name="SINA_APPKEY"/>
        <activity android:name="com.sina.weibo.sdk.web.WeiboSdkWebActivity"
            android:configChanges="keyboardHidden|orientation"
            android:exported="false"
            android:windowSoftInputMode="adjustResize">
        </activity>`);

      appendFeature(results.properties.features, {
        name: "OAuth",
        value: "io.dcloud.feature.oauth.OAuthFeatureImpl",
        module: {
          "OAuth-Sina": "io.dcloud.feature.oauth.sina.SinaOAuthService",
        },
      });
    }

    if (oauth?.univerify) {
      // HBuilderX 3.99及以上版本，个推sdk由aar导入改为仓储方式，所以请注意3.99版本的配置与低版本并不相同。
      results.libs.add("oauth-univerify-release.aar");

      results.gradleManifestPlaceholders.GETUI_APPID = oauth.univerify.appid ?? "";
      results.gradleManifestPlaceholders.GY_APP_ID = oauth.univerify.appid ?? "";
      results.gradleManifestPlaceholders.GT_INSTALL_CHANNEL = "HBuilder";

      results.rootGradleAllMaven.add("https://mvn.getui.com/nexus/content/repositories/releases");

      results.gradleDependencies.add("implementation 'com.getui:gtc-dcloud:3.2.16.7'");
      results.gradleDependencies.add("implementation('com.getui:gysdk:3.1.7.0') { exclude(group: 'com.getui') }");

      appendFeature(results.properties.features, {
        name: "OAuth",
        value: "io.dcloud.feature.oauth.OAuthFeatureImpl",
        module: {
          "OAuth-IGETui": "io.dcloud.feature.igetui.GeTuiOAuthService",
        },
      });
    }

    if (oauth?.weixin) {
      // 3.7.6及以上版本，微信SDK改为gradle依赖，需要将libs目录下的wechat-sdk-android-without-mta-X.X.X.aar移除
      results.libs.add("oauth-weixin-release.aar");

      results.gradleDependencies.add("implementation 'com.tencent.mm.opensdk:wechat-sdk-android-without-mta:6.8.0'");

      results.files[getWXEntryActivityFilePath(manifest)] = generateWXEntryActivity(manifest);

      results.permissions.add('<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS"/>');

      results.application.add(`<meta-data android:value="${oauth.weixin.appid}" android:name="WX_APPID"/>
        <activity android:name="${manifest["app-plus"]?.distribute?.android?.packagename}.wxapi.WXEntryActivity" 
            android:label="@string/app_name"  
            android:exported="true" 
            android:launchMode="singleTop"> 
            <intent-filter><action android:name="android.intent.action.VIEW"/>
              <category android:name="android.intent.category.DEFAULT"/> 
              <data android:scheme="${oauth.weixin.appid}"/>
            </intent-filter>
        </activity>`);

      appendFeature(results.properties.features, {
        name: "OAuth",
        value: "io.dcloud.feature.oauth.OAuthFeatureImpl",
        module: {
          "OAuth-Weixin": "io.dcloud.feature.oauth.weixin.WeiXinOAuthService",
        },
      });
    }
    // 小米登录
  }
}
