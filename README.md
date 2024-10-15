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
