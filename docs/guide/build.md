# 构建打包

使用 `uniapp build` 构建打包特定的平台。

## 帮助信息

```bash
uniapp help build
```

```
Usage: uniapp build <platform>

打包给定的平台

Arguments:
  platform                     要打包的平台: android,ios,h5,mp-weixin...

Options:
  --no-open                    不自动打开
  --mode <mode>                vite 环境模式
  --bundle <bundle>            打包产物: aab,apk(默认)
  --device <device>            运行到指定的设备上
  --keystore <keystore>        Android签名密钥文件所在位置
  --storepasswd <storepasswd>  Android签名密钥的密码
  --alias <alias>              Android签名密钥别名
  --keypasswd <keypasswd>      Android签名密钥别名的密码
  -h, --help                   帮助信息

示例:
  uniapp build android --bundle aab
  uniapp build ios
  uniapp build mp-weixin
```

## 参数说明

### --no-open

同 [运行参数--no-open](./run#no-open)。

- `H5` 平台此参数无效。

### --mode

同 [运行参数--mode](./run#mode)。

### --device

同 [运行参数--device](./run#device)。

### --keystore

同 [运行参数--keystore](./run#keystore)。

### --storepasswd

同 [运行参数--storepasswd](./run#storepasswd)。

### --alias

同 [运行参数--alias](./run#alias)。

### --keypasswd

同 [运行参数--keypasswd](./run#keypasswd)。

## H5

```bash
uniapp build h5
```

构建打包 `H5` 平台。

打包后的产物在目录 `dist/build/h5`。

## Android App

```bash
uniapp build android
```

构建打包 `Android` 平台。

## iOS App

```bash
uniapp build ios
```

🚧 WIP 正在开发中...

## 鸿蒙 App

```bash
uniapp build harmony
```

🚧 WIP 正在开发中...

## 微信小程序

```bash
uniapp build mp-weixin
```

构建打包 `微信小程序` 平台。

打包后的产物在目录 `dist/build/mp-weixin`。

如果配置了 [WEIXIN_DEV_TOOL](../config/#weixin-dev-tool)，则会自动打开开发者工具。

## 支付宝小程序

```bash
uniapp build mp-alipay
```

🚧 WIP 正在开发中...

## 百度小程序

```bash
uniapp build mp-baidu
```

🚧 WIP 正在开发中...

## 头条小程序

```bash
uniapp build mp-toutiao
```

🚧 WIP 正在开发中...

## 飞书小程序

```bash
uniapp build mp-lark
```

🚧 WIP 正在开发中...

## QQ 小程序

```bash
uniapp build mp-qq
```

🚧 WIP 正在开发中...

## 快手小程序

```bash
uniapp build mp-kuaishou
```

🚧 WIP 正在开发中...

## 京东小程序

```bash
uniapp build mp-jd
```

🚧 WIP 正在开发中...

## 360 小程序

```bash
uniapp build mp-360
```

🚧 WIP 正在开发中...

## 小红书小程序

```bash
uniapp build mp-xhs
```

🚧 WIP 正在开发中...

## 快应用

```bash
uniapp build quickapp-union
```

🚧 WIP 正在开发中...

## 华为快应用

```bash
uniapp build quickapp-huawei
```

🚧 WIP 正在开发中...
