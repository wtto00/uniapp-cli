# 启动运行

使用 `uniapp run` 启动运行特定的平台。

## 帮助信息

```shell
uniapp help run
```

```
Usage: uniapp run <platform>

开始运行给定的平台

Arguments:
  platform                     要运行的平台: android,ios,h5,mp-weixin...

Options:
  --mode <mode>                vite 环境模式
  --no-open                    不自动打开
  --hxcli [hxcli]              App使用HBuilderX的cli打包运行 (default: false)
  --device <device>            运行到指定的设备上
  --keystore <keystore>        Android签名密钥文件所在位置
  --storepasswd <storepasswd>  Android签名密钥的密码
  --alias <alias>              Android签名密钥别名
  --keypasswd <keypasswd>      Android签名密钥别名的密码
  -h, --help                   帮助信息

示例:
  uniapp run android --device myEmulator
  uniapp run ios
  uniapp run mp-weixin
```

## platform

`uniapp` 所支持的所有平台:

`h5`, `android`, `ios`, `harmony`, `mp-weixin`, `mp-alipay`, `mp-baidu`, `mp-toutiao`, `mp-lark`, `mp-qq`, `mp-kuaishou`, `mp-jd`, `mp-360`, `mp-xhs`, `quickapp-union`, `quickapp-huawei`

## --mode

`vite` 框架的 [模式](https://vitejs.cn/vite3-cn/guide/env-and-mode.html#modes) 配置。

仅在 `vue3` 项目时有效，`vue2` 项目此参数无效。

## --no-open

运行完毕后，是否自动打开平台所对应的工具。

各平台要打开的工具对应列表如下:

- h5: 默认浏览器
- android: 打包 `Android`，并打开已连接的 `Android` 设备或者模拟器
- mp-weixin: [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- ios: 🚧 WIP 正在开发中...
- harmony: 🚧 WIP 正在开发中...
- mp-alipay: 🚧 WIP 正在开发中...
- mp-baidu: 🚧 WIP 正在开发中...
- mp-toutiao: 🚧 WIP 正在开发中...
- mp-lark: 🚧 WIP 正在开发中...
- mp-qq: 🚧 WIP 正在开发中...
- mp-kuaishou: 🚧 WIP 正在开发中...
- mp-jd: 🚧 WIP 正在开发中...
- mp-360: 🚧 WIP 正在开发中...
- mp-xhs: 🚧 WIP 正在开发中...
- quickapp-union: 🚧 WIP 正在开发中...
- quickapp-huawei: 🚧 WIP 正在开发中...

## --device

运行到 `Android` 平台时，要打开的已连接设备的名称。设备名称可通过 `adb devices` 来获取。

如果存在多个已连接的 `Android` 设备或者模拟器，此参数会用到。

## --hxcli

`HBuilderX` 的 `cli` 可执行文件的位置。

如果在配置文件 `uniapp.config.json` 中配置了 `HBUILDERX_CLI`，则后面的参数可以省略，直接 `--hxcli`。

如果配置文件中没有配置，则需要添加上 `cli` 可执行文件的位置: `--hxcli /path/to/cli`。

## --keystore

安卓打包签名密钥文件所在位置。[查看配置 KEYSTORE_PATH](../config/#keystore-path)

## --storepasswd

安卓打包签名密钥文件的密码。[查看配置 KEYSTORE_PATH](../config/#keystore-path)

## --alias

安卓打包签名密钥别名。[查看配置 KEYSTORE_PATH](../config/#keystore-path)

## --keypasswd

安卓打包签名密钥别名的密码。[查看配置 KEYSTORE_PATH](../config/#keystore-path)
