# 平台管理

使用 `uniapp platform` 管理项目中的各平台。

## 帮助信息

```bash
uniapp help platform
```

```
Usage: uniapp platform <command> [options]

管理应用的平台

Options:
  -h, --help               帮助信息

Commands:
  add <platform...>        添加并安装给定的平台
  rm|remove <platform...>  移除并卸载给定的平台
  ls|list                  列出所有已安装和可用的平台
  help [command]           display help for command
```

## 列举各平台

使用 `ls` 或者 `list` 子命令，来列举出当前项目中，已安装和未安装的平台。

例如 `uniapp platform ls`，输出如下:

```
android:              ✖ 未安装
ios:                  ✖ 未安装
harmony:              ✖ 未安装
h5:                   ✔ 已安装
mp-weixin:            ✔ 已安装
mp-alipay:            ✔ 已安装
mp-baidu:             ✔ 已安装
mp-toutiao:           ✔ 已安装
mp-lark:              ✔ 已安装
mp-qq:                ✔ 已安装
mp-kuaishou:          ✔ 已安装
mp-jd:                ✔ 已安装
mp-360:               ✖ 未安装
mp-xhs:               ✔ 已安装
quickapp-union:       ✔ 已安装
quickapp-huawei:      ✔ 已安装
```

## 添加平台

使用 `add` 子命令，来添加所需要的平台。

会自动使用检测到的包管理器，从 `npm` 上安装 uniapp 所对应的平台包。比如微信小程序对应的依赖包为: `@dcloudio/uni-mp-weixin`。

::: code-group
对于 `Android` 平台，安装的时候，会自动下载离线打包 SDK 中的 `libs` 文件到本地目录中。具体可参见 [UNIAPP_ANDROID_SDK_URL](../config/#uniapp-android-sdk-url) 中的说明。

安装完成后，生成的 `Android` 原生工程项目在目录 `platform/android` 中。此时该原生项目并不完整，需要运行(`run`)或者打包(`build`)之后，才会补充完缺失的文件。
:::

**TODO**: `ios` 以及 `harmony` 平台离线 SDK 的说明。

## 移除平台

使用 `rm` 或者 `remove` 子命令，来移除不需要的平台。

会自动使用检测到的包管理器，卸载本地已安装的平台包。

对于 `Android` 平台，还会自动删除原生项目的目录 `platform/android`。

对于 `iOS` 平台，还会自动删除原生项目的目录 `platform/ios`。

对于 `Harmony` 平台，还会自动删除原生项目的目录 `platform/harmony`。
