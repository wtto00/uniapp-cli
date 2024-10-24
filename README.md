# uniapp-cli

CLI for Uniapp

## 🛠️ 正在开发中...

## 安装

```shell
npm i -g uniapp_cli
```

## 用法

```shell
uniapp --help
```

### 创建应用

```shell
uniapp create app-name
uniapp create -t <template> app-name
uniapp create --force app-name
uniapp create --no-cache app-name
```

TODO:

- 帮助信息中文
- 使用 Git 浅克隆，替换 degit
- 模板添加 vitess

### 检查环境

```shell
uniapp requirement android
uniapp requirement mp-weixin
uniapp requirements ios
```

TODO:

- 帮助信息中文
- 平台完善

### 平台

```shell
uniapp platform add android
uniapp platform rm android
uniapp platform ls
```

TODO:

- 帮助信息中文
- 平台完善

### 运行

```shell
uniapp platform run android --debug
uniapp platform run h5 --no-open
uniapp platform run android --device xxx
```

TODO:

- 帮助信息中文
- 平台完善

### 打包

```shell
uniapp platform build android --release
uniapp platform build h5
uniapp platform build android --device xxx
```

TODO:

- 帮助信息中文
- 平台完善

### 上传部署

```shell
uniapp platform up mp-weixin --release
uniapp platform upload h5
uniapp platform upload android --device xxx
```

TODO:

- 帮助信息中文
- 平台完善

## 版本注意事项

- **oauth.qq**: qq_mta-sdk-1.6.2.jar（3.6.7 以下版本需要）
- **oauth.univerify**: HBuilderX 3.99 及以上版本，个推 sdk 由 aar 导入改为仓储方式，所以请注意 3.99 版本的配置与低版本并不相同。
- **oauth.weixin**: 3.7.6 及以上版本，微信 SDK 改为 gradle 依赖，需要将 libs 目录下的 wechat-sdk-android-without-mta-X.X.X.aar 移除
- **oauth.google**: 3.2.7+ 版本新增支持
- **oauth.facebook**: 3.2.7+ 版本新增支持，Android 端在 4.31 版本后 Facebook 登录 SDK 默认携带 com.google.android.gms.permission.AD_ID 权限，如未使用广告相关功能在 GooglePlay 上架时会遇到审核问题，需要手动删除掉此权限，[删除权限文档](https://uniapp.dcloud.net.cn/tutorial/app-nativeresource-android.html#removepermissions)
- **dcloud_appkey**: 从 3.1.10 版本开始使用 App 离线 SDK 需要申请 Appkey
- **permissionExternalStorage.request**: HBuilderX2.5.0+开始支持。HBuilderX3.5.5+版本默认值调整为 none, HBuilderX3.0 以下版本默认值 always
- **permissionPhoneState.request**: HBuilderX2.3.8+版本开始支持。HBuilderX3.5.5+版本默认值调整为 none, HBuilderX3.0 以下版本默认值 once
- HBuilder X 3.5.0 及以上版本新增库 breakpad-build-release.aar
- HBuilder X 3.8.7 及以上版本新增库 install-apk-release.aar，上架谷歌应用市场不能包含此库，更多参考文档
- HBuilderX3.2.5 版本之后适配了 AndroidX。
- 添加 provider 信息到 Androidmanifest.xml 的 application 节点中, 3.3.7 及以上版本，可以不添加
- uts 插件: 需要 HBuilder X 4.18 版本及以上。
- compileSdkVersion: 4.06 更新为 34，3.8.12 更新为 33
- hasTaskAffinity: HX3.3.10+版本
- geolocation.amap: 3.7.6 开始不再提供"amap-libs-release.aar"文件 改为 gradle 集成！geolocation-amap-release.aar 还需要继续添加到项目中
- 3.7.6 开始不再提供"amap-libs-release.aar"文件。改为 gradle 集成。"weex_amap-release.aar"或"map-amap-release.aar"需要继续集成到项目中
- HBuilderX 3.99 及以上版本，个推 sdk 由 aar 导入改为仓储方式，所以请注意 3.99 版本的配置与低版本并不相同。
- 3.8.3 及以上版本，友盟 SDK 改为 gradle 依赖，需要将 libs 目录下的 umeng-abtest-v1.0.1.aar、utdid4all-XXX-proguard.jar 移除
- UTS 基础模块: 离线 SDK 3.7.6+ 版本支持
- HBuilder X 3.99 新增了 facialRecognitionVerify-support-release.aar 库，作用是应用可以在 X86 设备上正常运行，但调用 uni.startFacialRecognitionVerify()会触发错误回调。如果不支持 X86 设备，可以不用引入。
- 3.7.6 及以上版本，支付宝 SDK 改为 gradle 依赖，需要将 libs 目录下的 alipaysdk-android-15.8.11.aar 移除
- 3.7.6 及以上版本，微信 SDK 改为 gradle 依赖，需要将 libs 目录下的 wechat-sdk-android-without-mta-X.X.X.aar 移除
- 腾讯 TBS x5 内核: HBuilderX3.0.7+版本 CPU 类型配置开始支持“arm64-v8a”
- uni-ad.Sigmob: wind-common.aar(3.5.2 及以上版本)
- 百度广告,华为广告,uniMP 激励视频广告: 最低支持版本：离线 sdk 3.4.1

## 模块适配

- OAuth
- Bluetooth
- Speech
- Camera
- Share
- Geolocation
- Push
- Statistic
- Barcode
- FaceID
- Fingerprint
- FacialRecognitionVerify
- iBeacon
- LivePusher
- Maps
- Messaging
- Payment
- Record
- SQLite
- VideoPlayer
- Webview-x5
- UIWebview
