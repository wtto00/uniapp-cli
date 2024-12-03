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

## uni 一键登录

使用 `uni一键登录` 模块的，需要在 `manifest.json` 中配置 `app-plus.distribute.sdkConfigs.oauth.univerify.appid`。

## Facebook 登录

使用 `Facebook登录` 模块的，如果要上架 Google Play，需要在 `manifest.json` 中配置 `app-plus.distribute.sdkConfigs.oauth.facebook.permission_ad_remove` 为 `true`。

## 友盟统计

使用 `友盟统计` 模块的，如果要上架 Google Play，需要在 `manifest.json` 中配置 `app-plus.distribute.sdkConfigs.statics.umeng.google_play` 为 `true`。

## 消息推送

使用 `消息推送` 模块的，有原来的在 `开发者后台->unipush->配置管理->应用管理` 中配置，需要在 `manifest.json` 中添加如下配置:

```jsonc
{
  "app-plus": {
    "distribute": {
      "sdkConfigs": {
        "push": {
          "unipush": {
            "appid": "",
            "appkey": "",
            "appsecret": "",
            "hms": {
              "appid": "",
              "config": ""
            },
            "oppo": {
              "appkey": "",
              "appsecret": ""
            },
            "vivo": {
              "appid": "",
              "appkey": ""
            },
            "mi": {
              "appid": "",
              "appkey": ""
            },
            "meizu": {
              "appid": "",
              "appkey": ""
            },
            "honor": {
              "appid": ""
            },
            "fcm": {
              "serverkey": "",
              "channelid": "",
              "config_ios": "",
              "config_android": ""
            }
          }
        }
      }
    }
  }
}
```

## 高德地图

如果是在 `nvue` 页面中使用的高德地图，需要在 `manifest.json` 中配置 `app-plus.distribute.sdkConfigs.maps.amap.nvue` 为 `true`。

## 语音输入

使用 `语音输入` 模块的，需要在 `manifest.json` 中配置中，添加如下配置:

```json
{
  "app-plus": {
    "distribute": {
      "sdkConfigs": {
        "speech": {
          "baidu": {
            "__platform__": ["android", "ios"],
            "appid_android": "",
            "apikey_android": "",
            "secretkey_android": "",
            "appid_ios": "",
            "apikey_ios": "",
            "secretkey_ios": ""
          },
          "xunfei": {
            "appid": ""
          }
        }
      }
    }
  }
}
```
