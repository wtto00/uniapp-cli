# 检查环境要求

使用 `uniapp requirement` 或者 `uniapp requirements` 检查个平台的开发环境要求。

## 帮助信息

```bash
uniapp help requirement
```

```
Usage: uniapp requirements|requirement <platform ...>

检查给定平台的环境要求

Arguments:
  platform    想要检查的平台: android,ios,h5,mp-weixin...

Options:
  -h, --help  帮助信息

示例:
  uniapp requirements android
  uniapp requirement h5 mp-weixin
```

## H5

```bash
uniapp requirement h5
```

`H5` 不需要其他额外的环境。

## Android App

```bash
uniapp requirement android
```

开发 Android App 需要以下环境:

- **Java**: 版本 `1.8`，并设置 `JAVA_HOME` 环境变量或者在`uniapp-cli.config.json`中的`env`中设置`JAVA_HOME`
- **Android SDK**: 需要设置 `ANDROID_HOME` 环境变量为`Android SDK` 所在目录位置，或者在 `uniapp-cli.config.json`中的`env`中设置`ANDROID_HOME`。

  可在 `Android Studio` 中配置 `Android SDK`。如下图所示:

  ![Android SDK](/android-studio-sdk.png)

## iOS App

```bash
uniapp requirement ios
```

🚧 WIP 正在开发中...

## 鸿蒙 App

```bash
uniapp requirement harmony
```

🚧 WIP 正在开发中...

## 微信小程序

```bash
uniapp requirement mp-weixin
```

开发微信小程序需要以下环境:

- **微信开发者工具**: 需要设置 `WEIXIN_DEV_TOOL` 环境变量为微信开发者工具的 `cli`(`Widnows` 上为 `cli.bat`) 可执行文件所在的位置，或者在 `uniapp-cli.config.json`中的`env`中设置`WEIXIN_DEV_TOOL`。

  默认位置为:

  - Windows 上为: `C:\\Program Files (x86)\\Tencent\\微信web开发者工具\\cli.bat`
  - MacOS 上为: `/Applications/wechatwebdevtools.app/Contents/MacOS/cli`

## 支付宝小程序

```bash
uniapp requirement mp-alipay
```

🚧 WIP 正在开发中...

## 百度小程序

```bash
uniapp requirement mp-baidu
```

🚧 WIP 正在开发中...

## 头条小程序

```bash
uniapp requirement mp-toutiao
```

🚧 WIP 正在开发中...

## 飞书小程序

```bash
uniapp requirement mp-lark
```

🚧 WIP 正在开发中...

## QQ 小程序

```bash
uniapp requirement mp-qq
```

🚧 WIP 正在开发中...

## 快手小程序

```bash
uniapp requirement mp-kuaishou
```

🚧 WIP 正在开发中...

## 京东小程序

```bash
uniapp requirement mp-jd
```

🚧 WIP 正在开发中...

## 360 小程序

```bash
uniapp requirement mp-360
```

🚧 WIP 正在开发中...

## 小红书小程序

```bash
uniapp requirement mp-xhs
```

🚧 WIP 正在开发中...

## 快应用

```bash
uniapp requirement quickapp-union
```

🚧 WIP 正在开发中...

## 华为快应用

```bash
uniapp requirement quickapp-huawei
```

🚧 WIP 正在开发中...
