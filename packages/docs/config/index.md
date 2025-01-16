# 配置文件

所有配置项都可以在环境变量中配置或者在 `uniapp.config.json` 文件中配置。

在项目跟目录创建配置文件 `uniapp.config.json`，内容格式如下:

```json
{
  "UNIAPP_ANDROID_SDK_URL": "",
  "UNIAPP_SDK_HOME": "",
  "JAVA_HOME": "",
  "ANDROID_HOME": "",
  "KEYSTORE_PATH": "",
  "STORE_PASSWORD": "",
  "KEY_PASSWORD": "",
  "KEY_ALIAS": "",
  "WEIXIN_DEV_TOOL": "",
  "HBUILDERX_CLI": "",
  "UNI_CLOUD_PROVIDER": [
    {
      "accessTokenKey": "access_token_mp-****",
      "clientSecret": "****",
      "endpoint": "https://api.next.bspapp.com",
      "envType": "public",
      "provider": "aliyun",
      "requestUrl": "https://api.next.bspapp.com/client",
      "spaceId": "mp-****",
      "spaceName": "****",
      "id": "****"
    }
  ]
}
```

上述配置，等价与在环境变量中配置，是相同的效果。例如:

::: code-group

```shell
# Linux/MacOS
export UNIAPP_ANDROID_SDK_URL="https://wtto00.github.io/uniapp-android-sdk"
```

```shell
# Windows
set UNIAPP_ANDROID_SDK_URL="https://wtto00.github.io/uniapp-android-sdk"
```

:::

## UNIAPP_ANDROID_SDK_URL

安卓离线打包 SDK 的 libs 文件下载地址。

默认地址为: https://wtto00.github.io/uniapp-android-sdk ，本下载地址来源于项目 [wtto00/uniapp-android-sdk](https://github.com/wtto00/uniapp-android-sdk)。

如果使用默认地址下载速度太慢，可以克隆项目 [wtto00/uniapp-android-sdk](https://github.com/wtto00/uniapp-android-sdk) ，自己部署镜像。

也可以使用 [DCloud 官方离线 SDK 下载](https://nativesupport.dcloud.net.cn/AppDocs/download/android.html) 。下载完成后，把 SDK 中的 libs 文件夹内的文件复制到目录 [UNIAPP_SDK_HOME](#uniapp-sdk-home) 中。

DCloud 官方的百度云网盘，速度感人。这里分享一个我的阿里云盘的下载地址: https://www.alipan.com/s/aq2qTf9g5X4

## UNIAPP_SDK_HOME

离线 SDK 的下载保存的本地目录。

默认为: `~/.uniapp`

该目录结构为:

```
├── .uniapp
│   ├── android
│   │   ├── 3.0.0-4020920240930001
│   │   │   ├── ads-bd-release.aar
│   │   │   ├── ...
│   │   │   └── ...
│   │   ├── 3.0.0-4020820240925001
│   │   ├── ...
│   │   └── 3.0.0-4020420240722003
│   └── ios
│       ├── 3.0.0-4020920240930001
│       │   ├── ...
│       │   └── ...
│       ├── 3.0.0-4020820240925001
│       ├── ...
│       └── 3.0.0-4020420240722003
```

## JAVA_HOME

`JDK` 所在的目录位置。

推荐使用 `JDK>=17` 版本，低版本的 `JDK` ，运行可能会报错。

可使用 [清华大学 JDK 镜像](https://mirrors.tuna.tsinghua.edu.cn/Adoptium/)、[编程宝库 JDK 镜像](http://www.codebaoku.com/jdk/jdk-index.html)、[华为 JDK 镜像](https://repo.huaweicloud.com/java/jdk/) 快速下载 `JDK>=17`。

如果安装了 `Android Studio` ，也可以设置此变量为 `Android Studio` 安装目录下的 `jbr` 目录。例如:

- MacOS: `/Applications/Android Studio.app/Contents/jbr/Contents/Home`
- Windows: `/d/Program Files/Android/Android Studio/jbr`

## ANDROID_HOME

`Android SDK` 所在目录位置。

可在 `Android Studio` 中配置 `Android SDK`。如下图所示的 `Android SDK Location`:

![Android SDK](/android-studio-sdk.png)

## KEYSTORE_PATH

安卓打包签名密钥文件所在位置。

请使用绝对路径；如果使用相对路径，请注意是**相对于 `src` 目录中的位置**。

有几种等同效果的配置方式，以下按照优先级排序:

- 在 `run` 或者 `build` 命令中显式输入 `--keystore` 参数。
- `manifest.json` 中配置的 `app-plus.distribute.android.keystore`。
- `uniapp.config.json` 中配置的 `KEYSTORE_PATH`。
- 环境变量中配置 `KEYSTORE_PATH`。

## STORE_PASSWORD

安卓打包签名密钥文件的密码。

有几种等同效果的配置方式，以下按照优先级排序:

- 在 `run` 或者 `build` 命令中显式输入 `--storepasswd` 参数。
- `manifest.json` 中配置的 `app-plus.distribute.android.password`。
- `uniapp.config.json` 中配置的 `STORE_PASSWORD`。
- 环境变量中配置 `STORE_PASSWORD`。

## KEY_ALIAS

安卓打包签名密钥别名。

有几种等同效果的配置方式，以下按照优先级排序:

- 在 `run` 或者 `build` 命令中显式输入 `--alias` 参数。
- `manifest.json` 中配置的 `app-plus.distribute.android.aliasname`。
- `uniapp.config.json` 中配置的 `KEY_ALIAS`。
- 环境变量中配置 `KEY_ALIAS`。

## KEY_PASSWORD

安卓打包签名密钥别名的密码。

有几种等同效果的配置方式，以下按照优先级排序:

- 在 `run` 或者 `build` 命令中显式输入 `--keypasswd` 参数。
- `manifest.json` 中配置的 `app-plus.distribute.android.password`。
- `uniapp.config.json` 中配置的 `KEY_PASSWORD`。
- 环境变量中配置 `KEY_PASSWORD`。

## WEIXIN_DEV_TOOL

微信开发者工具的 `cli`(`Windows` 上为 `cli.bat`) 可执行文件所在的位置。

默认位置为:

- Windows 上为: `C:\\Program Files (x86)\\Tencent\\微信web开发者工具\\cli.bat`
- MacOS 上为: `/Applications/wechatwebdevtools.app/Contents/MacOS/cli`

## HBUILDERX_CLI

`HBuilderX` 的 `cli` 可执行文件的位置。

## UNI_CLOUD_PROVIDER

`uniCloud` 的配置信息，详情可参见 [uniCloud 适配](../adapter/unicloud)。
