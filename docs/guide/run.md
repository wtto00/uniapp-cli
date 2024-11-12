# 启动运行

使用 `uniapp run` 启动运行特定的平台。

## 帮助信息

```bash
uniapp help run
```

```
Usage: uniapp run <platform>

开始运行给定的平台

Arguments:
  platform           要运行的平台: android,ios,h5,mp-weixin...

Options:
  --no-open          不自动打开
  --mode <mode>      vite 环境模式
  --device <device>  运行到给定的设备上
  -h, --help         帮助信息

示例:
  uniapp run android --device myEmulator
  uniapp run ios
  uniapp run mp-weixin
```

## --no-open

运行完毕后，是否自动打开平台所对应的工具。

各平台要打开的工具对应列表如下:

- h5: 浏览器
- android: 已连接的 `Android` 设备或者模拟器
- mp-weixin: [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- 其他: 待开发

## --mode

`vite` 框架的 [模式](https://vitejs.cn/vite3-cn/guide/env-and-mode.html#modes) 配置。

## --device

运行到 `Android` 平台时，要打开的已连接设备的名称。设备名称可通过 `adb devices` 来获取。

如果存在多个已连接的 `Android` 设备或者模拟器，此参数会用到。

## H5

```bash
uniapp run h5
```

启动运行 `H5` 平台。

## Android App

```bash
uniapp run android
```

启动运行 `Android` 平台。

::: warning 注意事项
暂时不太清楚，DCloud 官方 App 的热更新是怎么做到的。所以暂时使用的方案是，每次更新都会卸载原来的 App 后，重新安装新打包的 App。如果有热更新的解决方案，非常期待您的 PR 或者讨论。
:::

## iOS App

```bash
uniapp run ios
```

🚧 WIP 正在开发中...

## 鸿蒙 App

```bash
uniapp run harmony
```

🚧 WIP 正在开发中...

## 微信小程序

```bash
uniapp run mp-weixin
```

启动运行 `微信小程序` 平台。

如果配置了 [WEIXIN_DEV_TOOL](../config/#weixin-dev-tool)，则会自动打开开发者工具。

## 支付宝小程序

```bash
uniapp run mp-alipay
```

🚧 WIP 正在开发中...

## 百度小程序

```bash
uniapp run mp-baidu
```

🚧 WIP 正在开发中...

## 头条小程序

```bash
uniapp run mp-toutiao
```

🚧 WIP 正在开发中...

## 飞书小程序

```bash
uniapp run mp-lark
```

🚧 WIP 正在开发中...

## QQ 小程序

```bash
uniapp run mp-qq
```

🚧 WIP 正在开发中...

## 快手小程序

```bash
uniapp run mp-kuaishou
```

🚧 WIP 正在开发中...

## 京东小程序

```bash
uniapp run mp-jd
```

🚧 WIP 正在开发中...

## 360 小程序

```bash
uniapp run mp-360
```

🚧 WIP 正在开发中...

## 小红书小程序

```bash
uniapp run mp-xhs
```

🚧 WIP 正在开发中...

## 快应用

```bash
uniapp run quickapp-union
```

🚧 WIP 正在开发中...

## 华为快应用

```bash
uniapp run quickapp-huawei
```

🚧 WIP 正在开发中...
