import type { ManifestConfig } from "@uniapp-cli/common";
import { isAbsolute, relative } from "node:path/posix";

export function buildBuildGradle(manifest: ManifestConfig) {
  const abiFilters: string[] = manifest["app-plus"].distribute.android.abiFilters || [];
  if (abiFilters.length === 0) {
    abiFilters.push("x86", "armeabi-v7a", "arm64-v8a");
  }

  return `apply plugin: 'com.android.application'

android {
    compileSdkVersion 30
    buildToolsVersion '30.0.3'
    defaultConfig {
        applicationId "${manifest["app-plus"].distribute.android.packagename}"
        minSdkVersion 21
        targetSdkVersion 28
        versionCode ${manifest.versionCode}
        versionName "${manifest.versionName}"
        multiDexEnabled true
        ndk {
            abiFilters ${abiFilters.map((item) => `'${item}'`).join(", ")}
        }
        manifestPlaceholders = [
                "apk.applicationId"     : "${manifest["app-plus"].distribute.android.packagename}",
                // "GETUI_APPID"           : "unipush的appid",
                // "plus.unipush.appid"    : "unipush的appid",
                // "plus.unipush.appkey"   : "unipuish的appkey",
                // "plus.unipush.appsecret": "unipush的secrety"
        ]
        compileOptions {
            sourceCompatibility JavaVersion.VERSION_1_8
            targetCompatibility JavaVersion.VERSION_1_8
        }
    }
    signingConfigs {
        config {
            keyAlias '${manifest["app-plus"].distribute.android.aliasname}'
            keyPassword '${
              manifest["app-plus"].distribute.android.aliaspassword || manifest["app-plus"].distribute.android.password
            }'
            storeFile file('${
              isAbsolute(manifest["app-plus"].distribute.android.keystore)
                ? manifest["app-plus"].distribute.android.keystore
                : relative("./platform/android/app/", manifest["app-plus"].distribute.android.keystore)
            }')
            storePassword '${manifest["app-plus"].distribute.android.password}'
            v1SigningEnabled true
            v2SigningEnabled true
        }
    }
    buildTypes {
        debug {
            signingConfig signingConfigs.config
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
        release {
            signingConfig signingConfigs.config
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }

    lintOptions {
        checkReleaseBuilds false
        abortOnError false
    }
    aaptOptions {
        additionalParameters '--auto-add-overlay'
        //noCompress 'foo', 'bar'
        ignoreAssetsPattern "!.svn:!.git:.*:!CVS:!thumbs.db:!picasa.ini:!*.scc:*~"
    }

}
repositories {
    flatDir {
        dirs 'libs'
    }
}
dependencies {
    implementation fileTree(include: ['*.jar', '*.aar'], dir: 'libs')
    /*uniapp所需库-----------------------开始*/
    implementation 'androidx.recyclerview:recyclerview:1.1.0'
    implementation 'com.facebook.fresco:fresco:2.5.0'
    implementation "com.facebook.fresco:animated-gif:2.5.0"
    /*uniapp所需库-----------------------结束*/
    // 基座需要，必须添加
    implementation 'com.github.bumptech.glide:glide:4.9.0'
    implementation 'com.alibaba:fastjson:1.2.83'
    implementation 'androidx.webkit:webkit:1.3.0'
    implementation 'androidx.appcompat:appcompat:1.1.0'
    implementation 'androidx.localbroadcastmanager:localbroadcastmanager:1.0.0'
    implementation 'androidx.core:core:1.1.0'
    implementation "androidx.fragment:fragment:1.1.0"
    // 微信
    //implementation 'com.tencent.mm.opensdk:wechat-sdk-android-without-mta:6.7.9'
    // 支付宝
    //implementation 'com.alipay.sdk:alipaysdk-android:15.8.11'
    // 高德
    //implementation 'com.amap.api:3dmap:9.5.0'
    //implementation 'com.amap.api:search:9.4.5'
    // 友盟统计
    //implementation 'com.umeng.umsdk:common:9.6.1'
    //implementation 'com.umeng.umsdk:asms:1.8.0'
    //implementation 'com.umeng.umsdk:abtest:1.0.1'
    //implementation 'com.umeng.umsdk:apm:1.9.1'

    //implementation 'com.getui:gtsdk:3.3.3.0'  //个推SDK
    //implementation 'com.getui:gtc:3.2.9.0'  //个推核心组件
}
`;
}

export function buildAndroidManifest(manifest: ManifestConfig) {
  return `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="${manifest["app-plus"].distribute.android.packagename}">

    ${manifest["app-plus"].distribute.android.permissions.join("\n")}

    <application
        android:name="io.dcloud.application.DCloudApplication"
        android:allowClearUserData="true"
        android:icon="@drawable/icon"
        android:label="@string/app_name"
        android:largeHeap="true"
        android:debuggable="true"
        >

        <activity
            android:name="io.dcloud.PandoraEntry"
            android:configChanges="orientation|keyboardHidden|keyboard|navigation"
            android:label="@string/app_name"
            android:launchMode="singleTask"
            android:hardwareAccelerated="true"
            android:theme="@style/TranslucentTheme"
            android:screenOrientation="user"
            android:windowSoftInputMode="adjustResize" >
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Statistic(统计)-友盟统计 begin -->
        <!-- 官方网站：http://www.umeng.com/analytics -->
        <!-- meta-data节点android:name="UMENG_APPKEY"项中android:value值为友盟网站申请的APPKEY -->
        <!-- meta-data节点android:name="UMENG_CHANNEL"项中android:value值为发行渠道标识，可任意取值，用于各种发行渠道效果统计 -->
        <!-- <meta-data
            android:name="UMENG_APPKEY"
            android:value="${manifest["app-plus"].distribute.sdkConfigs?.statics?.umeng?.appkey_android || ""}" />
        <meta-data
            android:name="UMENG_CHANNEL"
            android:value="${
              manifest["app-plus"].distribute.sdkConfigs?.statics?.umeng?.channelid_android || ""
            }" /> -->
        <!-- 友盟统计  配置  end -->

        <!-- Maps(地图) begin -->
        <!-- meta-data节点android:name="com.baidu.lbsapi.API_KEY"项中android:value值为百度地图应用的Appkey -->
        <!-- <meta-data
            android:name="com.baidu.lbsapi.API_KEY"
            android:value="${manifest["app-plus"].distribute.sdkConfigs?.maps?.baidu?.appkey_android || ""}"/>
        <service
            android:name="com.baidu.location.f"
            android:enabled="true"
            android:process=":remote"/> -->
        <!-- Maps(地图) end -->
        <!-- <meta-data android:name="com.amap.api.v2.apikey"
            android:value="${manifest["app-plus"].distribute.sdkConfigs?.maps?.amap?.appkey_android || ""}"/>
        <service android:name="com.amap.api.location.APSService" /> -->

        <!-- Oauth 授权登陆 start -->
        <!-- Oauth QQ start -->
        <!-- QQ 分享 配置和授权登陆相同 -->
        <!-- <meta-data
            android:name="QQ_APPID"
            android:value="${manifest["app-plus"].distribute.sdkConfigs?.share?.qq?.appid || ""}" />

        <activity
            android:name="com.tencent.tauth.AuthActivity"
            android:launchMode="singleTask"
            android:noHistory="true">
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />

                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />

                <data android:scheme="${manifest["app-plus"].distribute.sdkConfigs?.share?.qq?.appid || ""}" />
            </intent-filter>
        </activity>
        <activity
            android:name="com.tencent.connect.common.AssistActivity"
            android:screenOrientation="portrait"
            android:theme="@android:style/Theme.Translucent.NoTitleBar" /> -->
        <!-- Oauth QQ end -->


        <!-- Oauth Sina start -->


        <!-- Oauth Sina end -->
        <!-- Oauth 授权登陆 end -->

        <!-- Share(分享) begin -->
        <!-- Share - 新浪微博分享 -->
        <!-- 官方网站：http://open.weibo.com/ -->
        <!-- <meta-data
            android:name="SINA_REDIRECT_URI"
            android:value="${manifest["app-plus"].distribute.sdkConfigs?.share?.sina?.redirect_uri || ""}" />
        <meta-data
            android:name="SINA_SECRET"
            android:value="${manifest["app-plus"].distribute.sdkConfigs?.share?.sina?.secret || ""}" />
        <meta-data
            android:name="SINA_APPKEY"
            android:value="${manifest["app-plus"].distribute.sdkConfigs?.share?.sina?.appkey || ""}" /> -->
        <!-- 分享 -->

        <!-- 微信分享 配置begin -->
        <!-- <meta-data
            android:name="WX_SECRET"
            android:value="${manifest["app-plus"].distribute.sdkConfigs?.share?.weixin?.secret || ""}" />
        <meta-data
            android:name="WX_APPID"
            android:value="${manifest["app-plus"].distribute.sdkConfigs?.share?.weixin?.appid || ""}" />

        <activity
            android:name=".wxapi.WXEntryActivity"
            android:exported="true"
            android:label="@string/app_name"
            android:launchMode="singleTop">
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />

                <category android:name="android.intent.category.DEFAULT" />

                <data android:scheme="${manifest["app-plus"].distribute.sdkConfigs?.share?.weixin?.appid || ""}" />
            </intent-filter>
        </activity> -->
        <!-- 微信分享 配置 end -->

        <!-- 微信支付配置 start -->
        <!-- <activity
            android:name=".wxapi.WXPayEntryActivity"
            android:exported="true"
            android:launchMode="singleTop" />

        <meta-data
            android:name="WX_APPID"
            android:value="${manifest["app-plus"].distribute.sdkConfigs?.share?.weixin?.appid || ""}" /> -->

        <!-- 微信支付配置end -->
        <!-- 小米分享 -->
        <!-- <meta-data
            android:name="MIUI_APPID"
            android:value="_%小米分享的APPID%" />
        <meta-data
            android:name="MIUI_APPSECRET"
            android:value="%小米分享的appSecret%" />
        <meta-data
            android:name="MIUI_REDIRECT_URI"
            android:value="%小米分享的回调地址%" />

        <activity android:name="com.xiaomi.account.openauth.AuthorizeActivity" /> -->
        <!-- 小米分享 end -->
        <!-- Dcloud 开屏广告配置>
        <meta-data android:name="DCLOUD_STREAMAPP_CHANNEL" android:value="io.dcloud.H57BCF8D2|H57BCF8D2|12331280401"></meta-data>
        <meta-data android:name="DCLOUD_AD_ID" android:value="-553621487"></meta-data>
        <meta-data android:name="DCLOUD_AD_SPLASH" android:value="true"></meta-data>
        < Dcloud 开屏广告配置-->
        <!--百度语音识别 start-->
        <!--<meta-data android:name="com.baidu.speech.APP_ID" android:value="百度语音的appid"/>
        <meta-data android:name="com.baidu.speech.API_KEY" android:value="百度语音的appkey"/>
        <meta-data android:name="com.baidu.speech.SECRET_KEY" android:value="百度语音的secret"/>
        <service android:name="com.baidu.speech.VoiceRecognitionService" android:exported="false" />-->
        <!--百度语音识别 end-->

        <activity
            android:name="io.dcloud.PandoraEntryActivity"
            android:launchMode="singleTask"
            android:configChanges="orientation|keyboardHidden|screenSize|mcc|mnc|fontScale|keyboard|smallestScreenSize|screenLayout|screenSize|uiMode"
            android:hardwareAccelerated="true"
            android:permission="com.miui.securitycenter.permission.AppPermissionsEditor"
            android:screenOrientation="user"
            android:theme="@style/DCloudTheme"
            android:windowSoftInputMode="adjustResize">

            <intent-filter>

                <category
                    android:name="android.intent.category.DEFAULT" />

                <category
                    android:name="android.intent.category.BROWSABLE" />

                <action
                    android:name="android.intent.action.VIEW" />

                <data
                    android:scheme=" " />
            </intent-filter>
        </activity>
        <meta-data
            android:name="dcloud_appkey"
            android:value="${manifest["app-plus"].distribute.android.dcloud_appkey}" />
    </application>

</manifest>
`;
}
