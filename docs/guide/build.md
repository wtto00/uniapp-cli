# 构建打包

使用 `uniapp build` 构建打包特定的平台。

## 帮助信息

```shell
uniapp help build
```

```
Usage: uniapp build <platform>

打包给定的平台

Arguments:
  platform                     要打包的平台: android,ios,h5,mp-weixin...

Options:
  --mode <mode>                vite 环境模式
  --no-open                    不自动打开
  --bundle <bundle>            Android打包产物: aab,apk(默认),wgt
  --device <device>            Android运行到指定的设备上
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

## --mode

同 [运行参数--mode](./run#mode)。

## --no-open

同 [运行参数--no-open](./run#no-open)。

- `H5` 平台此参数无效。`H5` 平台打包完成后，不会自动打开默认浏览器。

## --bundle

Android 平台的打包格式，可选值为：`apk`, `aab`, `wgt`。

默认为 `apk`。

## --device

同 [运行参数--device](./run#device)。

## --keystore

同 [运行参数--keystore](./run#keystore)。

## --storepasswd

同 [运行参数--storepasswd](./run#storepasswd)。

## --alias

同 [运行参数--alias](./run#alias)。

## --keypasswd

同 [运行参数--keypasswd](./run#keypasswd)。
