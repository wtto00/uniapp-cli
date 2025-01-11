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

## UTS 运行热更新

由于 DCloud 的限制，如果项目中使用了 UTS 插件，则需要使用`HBuilderX`的`cli`来启动运行。
即在 `run android` 命令中添加参数 `--hxcli [/path/to/cli]`。

如果项目中没有使用 UTS 插件，则不需要`HBuilderX`启动运行，但是如果手动加上了参数`--hxcli`，则依然会使用`HBuilderX`的`cli`来启动运行。
