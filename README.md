# uniapp-cli

CLI for Uniapp

## 版本注意事项

- **oauth.qq**: qq_mta-sdk-1.6.2.jar（3.6.7以下版本需要）
- **oauth.univerify**: HBuilderX 3.99及以上版本，个推sdk由aar导入改为仓储方式，所以请注意3.99版本的配置与低版本并不相同。
- **oauth.weixin**: 3.7.6及以上版本，微信SDK改为gradle依赖，需要将libs目录下的wechat-sdk-android-without-mta-X.X.X.aar移除
- **dcloud_appkey**: 从3.1.10版本开始使用App离线SDK需要申请Appkey
- **permissionExternalStorage.request**: HBuilderX3.5.5+版本默认值调整为none, HBuilderX3.0以下版本默认值always
