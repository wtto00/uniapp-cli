# 内置模块适配指南

## 消息推送

如果使用 `消息推送` 模块，原本使用云打包需要在 `开发者后台->unipush->配置管理->应用管理` 中配置 `appid` 等信息。

现在离线打包需要在 `manifest.json` 中添加如下配置:

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

## 语音输入

如果使用 `语音输入` 模块的，需要在 `manifest.json` 中配置中，添加如下配置:

```jsonc
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

## uni 一键登录

使用 `uni一键登录` 模块的，需要在 `manifest.json` 中配置 `app-plus.distribute.sdkConfigs.oauth.univerify.appid`。

## 高德地图

如果是在 `nvue` 页面中使用的高德地图，需要在 `manifest.json` 中配置 `app-plus.distribute.sdkConfigs.maps.amap.nvue` 为 `true`。
