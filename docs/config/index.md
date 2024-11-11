# 配置文件

在项目跟目录创建配置文件 `uniapp-cli.config.json`，内容如下:

```json
{
  "env": {
    "UNIAPP_ANDROID_SDK_URL": "",
    "UNIAPP_SDK_HOME": "",
    "JAVA_HOME": "",
    "ANDROID_HOME": "",
    "KEYSTORE_PATH": "",
    "STORE_PASSWORD": "",
    "KEY_PASSWORD": "",
    "KEY_ALIAS": "",
    "WEIXIN_DEV_TOOL": "",
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
}
```

上述配置中的 `env` 配置，等价与在环境变量中配置，是相同的效果。例如:

::: code-group

```bash
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

也可以使用 [DCloud 官方离线 SDK 下载](https://nativesupport.dcloud.net.cn/AppDocs/download/android.html) 。下载完成后，把 SDK 中的 libs 文件夹内的文件复制到目录 [UNIAPP_SDK_HOME](#UNIAPP_SDK_HOME) 中。

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

推荐使用 `JDK8` 版本，其他版本的 `JDK` ，运行可能会报错。

可使用 [清华大学镜像](https://mirrors.tuna.tsinghua.edu.cn/Adoptium/) 快速下载 `JDK8`。

如果安装了 `Android Studio` ，也可以设置此变量为 `Android Studio` 安装目录下的 `jbr` 目录。例如:

- MacOS: `/Applications/Android Studio.app/Contents/jbr/Contents/Home`
- Windows: `/d/Program Files/Android/Android Studio/jbr`

不过**不推荐这样做**，因为`Android Studio`自带的 `JDK`版本过高，运行时可能会报错。

## ANDROID_HOME

`Android SDK` 所在目录位置。

可在 `Android Studio` 中配置 `Android SDK`。如下图所示的 `Android SDK Location`:

![Android SDK](/android-studio-sdk.png)

## KEYSTORE_PATH

安卓打包签名密钥文件所在位置。

请使用绝对路径；如果使用相对路径，请注意是**相对于 `src` 目录中的位置**。

等同于使用环境变量，也可以在项目中的 `manifest.json` 中配置 `app-plus.distribute.android.keystore`。

三种方式都是一样的效果。

优先级是 `manifest.json中的配置` > `uniapp-cli.config.json中的配置` > `环境变量中的配置`。

以下 `STORE_PASSWORD`, `KEY_PASSWORD`, `KEY_ALIAS` 是同样的逻辑。

## STORE_PASSWORD

安卓打包签名密钥文件的密码。

等同于使用环境变量，也可以在项目中的 `manifest.json` 中配置 `app-plus.distribute.android.password`。

## KEY_PASSWORD

安卓打包签名密钥别名的密码。

等同于使用环境变量，也可以在项目中的 `manifest.json` 中配置 `app-plus.distribute.android.password`。

## KEY_ALIAS

安卓打包签名密钥别名。

等同于使用环境变量，也可以在项目中的 `manifest.json` 中配置 `app-plus.distribute.android.aliasname`。

## WEIXIN_DEV_TOOL

微信开发者工具的 `cli`(`Widnows` 上为 `cli.bat`) 可执行文件所在的位置。

默认位置为:

- Windows 上为: `C:\\Program Files (x86)\\Tencent\\微信web开发者工具\\cli.bat`
- MacOS 上为: `/Applications/wechatwebdevtools.app/Contents/MacOS/cli`

## UNI_CLOUD_PROVIDER

`uniCloud` 的配置信息，详情可参见 [uniCloud 适配](../adapter/unicloud)。
