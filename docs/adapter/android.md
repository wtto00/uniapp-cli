# Android 适配指南

## 开发环境要求

参见 [Requiement Android App](../guide/requirement.html#android-app)。

## appkey

需要在 `manifest.json` 中配置 `app-plus.distribute.android.dcloud_appkey`。

[appkey 申请说明](https://nativesupport.dcloud.net.cn/AppDocs/usesdk/appkey.html)

## 签名配置

运行或者打包需要配置签名，否则会和 `appkey` 不对应，而无法运行。

签名主要包括四个信息:

- **keystore**: [查看配置 KEYSTORE_PATH](../config/#keystore-path)
- **storepasswd**: [查看配置 STORE_PASSWORD](../config/#store-password)
- **alias**: [查看配置 KEY_ALIAS](../config/#key-alias)
- **keypasswd**: [查看配置 KEY_PASSWORD](../config/#key-password)

## 上架 Google Play

- 在 `manifest.json` 中配置 `app-plus.distribute.android.installApkSdk` 为 `false`。
- 如果使用了 `友盟统计` 模块，需要在 `manifest.json` 中配置 `app-plus.distribute.sdkConfigs.statics.umeng.google_play` 为 `true`。
- 如果使用了 `Facebook登录` 模块，需要在 `manifest.json` 中配置 `app-plus.distribute.sdkConfigs.oauth.facebook.permission_ad_remove` 为 `true`。
