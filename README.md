# uniapp-cli

CLI for Uniapp

## 版本注意事项

- **oauth.qq**: qq_mta-sdk-1.6.2.jar（3.6.7以下版本需要）
- **oauth.univerify**: HBuilderX 3.99及以上版本，个推sdk由aar导入改为仓储方式，所以请注意3.99版本的配置与低版本并不相同。
- **oauth.weixin**: 3.7.6及以上版本，微信SDK改为gradle依赖，需要将libs目录下的wechat-sdk-android-without-mta-X.X.X.aar移除
- **oauth.google**: 3.2.7+ 版本新增支持
- **oauth.facebook**: 3.2.7+ 版本新增支持，Android端在4.31版本后Facebook登录SDK默认携带com.google.android.gms.permission.AD_ID权限，如未使用广告相关功能在GooglePlay上架时会遇到审核问题，需要手动删除掉此权限，[删除权限文档](https://uniapp.dcloud.net.cn/tutorial/app-nativeresource-android.html#removepermissions)
- **dcloud_appkey**: 从3.1.10版本开始使用App离线SDK需要申请Appkey
- **permissionExternalStorage.request**: HBuilderX2.5.0+开始支持。HBuilderX3.5.5+版本默认值调整为none, HBuilderX3.0以下版本默认值always
- **permissionPhoneState.request**: HBuilderX2.3.8+版本开始支持。HBuilderX3.5.5+版本默认值调整为none, HBuilderX3.0以下版本默认值once
- HBuilder X 3.5.0及以上版本新增库breakpad-build-release.aar
- HBuilder X 3.8.7及以上版本新增库install-apk-release.aar，上架谷歌应用市场不能包含此库，更多参考文档
- HBuilderX3.2.5版本之后适配了AndroidX。
- 添加provider信息到Androidmanifest.xml的application节点中, 3.3.7及以上版本，可以不添加
- uts插件: 需要HBuilder X 4.18版本及以上。
- compileSdkVersion: 4.06更新为34，3.8.12更新为33
- hasTaskAffinity: HX3.3.10+版本
- geolocation.amap: 3.7.6开始不再提供"amap-libs-release.aar"文件 改为gradle集成！geolocation-amap-release.aar还需要继续添加到项目中
- 3.7.6开始不再提供"amap-libs-release.aar"文件。改为gradle集成。"weex_amap-release.aar"或"map-amap-release.aar"需要继续集成到项目中
- HBuilderX 3.99及以上版本，个推sdk由aar导入改为仓储方式，所以请注意3.99版本的配置与低版本并不相同。
- 3.8.3及以上版本，友盟SDK改为gradle依赖，需要将libs目录下的umeng-abtest-v1.0.1.aar、utdid4all-XXX-proguard.jar移除
- UTS 基础模块: 离线SDK 3.7.6+ 版本支持
- HBuilder X 3.99 新增了facialRecognitionVerify-support-release.aar库，作用是应用可以在X86设备上正常运行，但调用uni.startFacialRecognitionVerify()会触发错误回调。如果不支持X86设备，可以不用引入。
- 3.7.6及以上版本，支付宝SDK改为gradle依赖，需要将libs目录下的alipaysdk-android-15.8.11.aar移除
- 3.7.6及以上版本，微信SDK改为gradle依赖，需要将libs目录下的wechat-sdk-android-without-mta-X.X.X.aar移除
- 腾讯TBS x5内核: HBuilderX3.0.7+版本CPU类型配置开始支持“arm64-v8a”
- uni-ad.Sigmob: wind-common.aar(3.5.2及以上版本)
- 百度广告,华为广告,uniMP激励视频广告: 最低支持版本：离线sdk 3.4.1
