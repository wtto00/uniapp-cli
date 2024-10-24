export interface NetworkTimeout {
  /**
   * uni.request 超时时间
   * 单位为 ms
   * 默认为 60000
   */
  request?: number
  /**
   * uni.connectSocket 超时时间
   * 单位为 ms
   * 默认为 60000
   */
  connectSocket?: number
  /**
   * uni.uploadFile 超时时间
   * 单位为 ms
   * 默认为 60000
   */
  uploadFile?: number
  /**
   * uni.downloadFile 超时时间
   * 单位为 ms
   * 默认为 60000
   */
  downloadFile?: number
}
export interface UniStatistics {
  /**
   * 是否开启 uni 统计
   * 默认为 false
   */
  enable?: boolean
  /**
   * uni 统计版本
   * 默认为 1
   */
  version?: '1' | '2'
  /**
   * 是否开启统计调试模式
   * 生产阶段务必关闭
   * 默认为 false
   */
  debug?: boolean
  /**
   * 前端数据上报周期
   * 默认为 10
   */
  reportInterval?: number
  /** 采集项配置 */
  collectItems?: {
    /**
     * 是否开启推送 PushClientID 的采集
     * 默认为 false
     */
    uniPushClientID?: boolean
  }
}
export interface SimpleUniStatistics extends Pick<UniStatistics, 'enable'> {}
/** PNG格式的图片 */
export type PNG = `${string}.png` | `${string}.PNG`
/** App图标配置 */
export interface AppPlusIcons {
  /** Android平台 */
  android?: {
    /** 2K屏设备程序图标，分辨率要求192x192 */
    xxxhdpi?: PNG
    /** 1080P高分屏设备程序图标，分辨率要求144x144 */
    xxhdpi?: PNG
    /** 720P高分屏设备程序图标，分辨率要求96x96 */
    xhdpi?: PNG
    /** 高分屏设备程序图标，分辨率要求72x72 */
    hdpi?: PNG
    /** 普通屏设备程序图标，分辨率要求48x48，这类设备很少见，可以不配置 */
    mdpi?: PNG
    /** 大屏设备程序图标，分辨率要求48x48，这类设备很少见，可以不配置 */
    ldpi?: PNG
  }
  /** iOS平台 */
  ios?: {
    /** App Store图标路径，分辨率要求1024x1024 */
    appstore?: PNG
    /** iPad设备程序图标 */
    ipad?: {
      /** iOS7+设备程序主图标，分辨率要求76x76 */
      app?: PNG
      /** iOS7+高分屏设备程序主图标，分辨率要求152x152 */
      'app@2x'?: PNG
      /** iOS7+设备通知栏图标，分辨率要求20x20 */
      notification?: PNG
      /** iOS7+高分屏设备通知栏图标，分辨率要求40x40 */
      'notification@2x'?: PNG
      /** iOS9+ iPad Pro(12.9英寸)设备程序主图标，分辨率要求167x167 */
      'proapp@2x'?: PNG
      /** iOS5+设备Settings设置图标，分辨率要求29x29 */
      settings?: PNG
      /** iOS5+高分屏设备Settings设置图标，分辨率要求58x58 */
      'settings@2x'?: PNG
      /** iOS7+设备Spotlight搜索图标，分辨率要求40x40 */
      spotlight?: PNG
      /** iOS7+高分屏设备Spotlight搜索图标，分辨率要求80x80 */
      'spotlight@2x'?: PNG
    }
    /** iPhone设备程序图标 */
    iphone?: {
      /** iOS7+设备程序主图标，分辨率要求120x120 */
      'app@2x'?: PNG
      /** iOS7+设备程序主图标，分辨率要求180x180 */
      'app@3x'?: PNG
      /** iOS7+设备通知栏图标，分辨率要求40x40 */
      'notification@2x'?: PNG
      /** iOS7+设备通知栏图标，分辨率要求60x60 */
      'notification@3x'?: PNG
      /** iOS7+设备Settings设置图标，分辨率要求58x58 */
      'settings@2x'?: PNG
      /** iOS7+设备Settings设置图标，分辨率要求87x87 */
      'settings@3x'?: PNG
      /** iOS7+设备Spotlight搜索图标，分辨率要求80x80 */
      'spotlight@2x'?: PNG
      /** iOS7+设备Spotlight搜索图标，分辨率要求120x120 */
      'spotlight@3x'?: PNG
    }
  }
}
export enum PermissionRequest {
  ALWAYS = 'always',
  ONCE = 'once',
  NONE = 'none',
}
export interface AppPlusDistributeAndroid {
  /**
   * 从3.1.10版本开始使用App离线SDK需要申请Appkey
   * @see https://nativesupport.dcloud.net.cn/AppDocs/usesdk/appkey.html
   */
  dcloud_appkey?: string
  /** Android平台云端打包的包名 */
  packagename?: string
  /** Android平台云端打包使用的签名证书文件路径 */
  keystore?: string
  /** Android平台云端打包使用的签名证书的密码，要求证书存储密码和证书密码相同 */
  password?: string
  /** Android平台云端打包使用的证书别名 */
  aliasname?: string
  /** Android平台App注册的scheme，多个scheme使用“,”分割，详情参考：Android平台设置UrlSchemes */
  schemes?: string
  /** Android平台App支持的cpu类型，详情参考：Android平台设置CPU类型 */
  abiFilters?: string[]
  /** Android平台App使用的权限 */
  permissions?: string[]
  /** 是否自定义Android权限配置 */
  custompermissions?: boolean
  /** Android平台应用启动时申请读写手机存储权限策略配置，详情参考：Android平台应用启动时读写手机存储权限策略，支持request、prompt属性
   * @see https://ask.dcloud.net.cn/article/36549
   */
  permissionExternalStorage?: {
    /**
     * 字符串类型，必填，申请读写手机存储权限策略，可取值none、once、always。
     * HBuilderX3.5.5+版本默认值调整为none
     * HBuilderX3.0以下版本默认值always
     * - none?: 应用启动时不申请
     * - once?: 应用第一次启动时申请，用户可以拒绝
     * - always?: 应用每次启动都申请，并且用户必须允许，用户拒绝时会弹出以下提示框引导用户重新允许
     */
    request?: PermissionRequest
    /**
     * 字符串类型，可选，用户拒绝时弹出提示框上的内容。
     * 默认值为：应用保存运行状态等信息，需要获取读写手机存储（系统提示为访问设备上的照片、媒体内容和文件）权限，请允许。
     * 设置自定义键名称为“dcloud_permission_write_external_storage_message”。
     */
    prompt?: string
  }
  /** Android平台应用启动时申请读取设备信息权限配置，详情参考：Android平台应用启动时访问设备信息(如IMEI)权限策略，支持request、prompt属性
   * @see https://ask.dcloud.net.cn/article/36549
   */
  permissionPhoneState?: {
    /**
     * 字符串类型，必填，申请设备信息权限策略，可取值none、once、always。默认值为once。
     * - none?: 应用启动时不申请
     * - once?: 应用第一次启动时申请，用户可以拒绝
     * - always?: 应用每次启动都申请，并且用户必须允许，用户拒绝时会弹出以下提示框引导用户重新允许
     */
    request?: PermissionRequest
    /**
     * 字符串类型，可选，用户拒绝时弹出提示框上的内容。
     * 默认值为：为保证您正常、安全地使用，需要获取设备识别码（部分手机提示为获取手机号码）使用权限，请允许。
     * 设置自定义键名称为“dcloud_permission_read_phone_state_message”。
     */
    prompt?: string
  }
  compileSdkVersion?: number
  /** Android平台最低支持版本，详情参考：Android平台设置minSdkVersion
   * @see https://uniapp.dcloud.net.cn/tutorial/app-android-minsdkversion.html
   */
  minSdkVersion?: number
  /** Android平台目标版本，详情参考：Android平台设置targetSdkVersion
   * @see https://uniapp.dcloud.net.cn/tutorial/app-android-targetsdkversion.html
   */
  targetSdkVersion?: number
  /** Android平台云端打包时build.gradle的packagingOptions配置项，
   * @example
   * "packagingOptions": ["doNotStrip '/armeabi-v7a/.so'","merge '**\/LICENSE.txt'"]
   */
  packagingOptions?: string[]
  /**
   * @deprecated
   * uni-app使用的JS引擎，可取值v8、jsc，将废弃，后续不再支持jsc引擎 */
  jsEngine?: 'v8' | 'jsc'
  /** 是否开启Android调试开关 */
  debuggable?: boolean
  /** 应用的默认语言 */
  locale?: string
  /** 是否强制允许暗黑模式 */
  forceDarkAllowed?: boolean
  /** 是否支持分屏调整窗口大小 */
  resizeableActivity?: boolean
  /** 是否设置android：taskAffinity，详见 */
  hasTaskAffinity?: boolean
  /** Android平台云端打包时build.gradle的buildFeatures配置项，[详见](https://developer.android.google.cn/reference/tools/gradle-api/7.1/com/android/build/api/dsl/BuildFeatures) */
  buildFeatures?: {
    aidl?: boolean
    buildConfig?: boolean
    compose?: boolean
    prefab?: boolean
    renderScript?: boolean
    resValues?: boolean
    shaders?: boolean
    viewBinding?: boolean
  }
  /** 延迟初始化UniPush的配置，当配置此项值为manual后UniPush不会初始化，
   * 直到首次调用getPushClientId、getClientInfo、getClientInfoAsync时才会初始化，
   * 注:一旦调用获取cid的方法后，下次App启动就不再延迟初始化UniPush了。(manual为延迟，其他值表示不延迟。)
   */
  pushRegisterMode?: 'manual'
  /** 是否支持获取OAID，默认值为true，[详见](https://uniapp.dcloud.net.cn/collocation/manifest-app.html#enableoaid) */
  enableOAID?: boolean
  /**
   * 是否集成install-apk-release.aar，默认为true集成
   * HBuilder X 3.8.7及以上版本新增库install-apk-release.aar，上架谷歌应用市场不能包含此库
   */
  installApkSdk?: boolean
}
/**
 * 功能模块
 * @see https://uniapp.dcloud.net.cn/tutorial/app-modules.html#%E5%8A%9F%E8%83%BD%E6%A8%A1%E5%9D%97
 */
export interface AppPlusModules {
  /** 登录授权 */
  OAuth?: object
  /** BLE蓝牙 */
  Bluetooth?: object
  /** 语音识别 */
  Speech?: object
  /** 调用相机拍照，访问或修改相册 */
  Camera?: object
  /** 社交分享 */
  Share?: object
  /** 获取位置信息 */
  Geolocation?: object
  /** 消息推送 */
  Push?: object
  /** 统计 */
  Statistic?: object
  /** 调用相机扫码功能 */
  Barcode?: object
  /** 系统通讯录 */
  Contacts?: object
  /** 访问系统人脸识别 */
  FaceID?: object
  /** 指纹识别 */
  Fingerprint?: object
  /**
   * 实人认证
   * - 为对抗攻击，实人认证SDK返回的错误原因比较模糊。
   * - App-Android平台要求Android5（API Leavel 21）及以上系统，App-iOS平台要求iOS9及以上系统
   * - App端使用实人认证SDK，需在隐私政策的三方SDK中添加实人认证功能描述，参考[详情](https://ask.dcloud.net.cn/article/39484#FacialRecognitionVerify)
   * - [离线打包](https://nativesupport.dcloud.net.cn/AppDocs/usemodule/androidModuleConfig/facialRecognitionVerify.html)
   * @see https://uniapp.dcloud.net.cn/tutorial/app-facialRecognitionVerify.html
   * @see https://doc.dcloud.net.cn/uniCloud/frv/intro.html
   */
  FacialRecognitionVerify?: object
  /** iBeacon */
  iBeacon?: object
  /** 直播推流 */
  LivePusher?: object
  /** 地图 */
  Maps?: object
  /** 短彩邮件消息 */
  Messaging?: object
  /** 支付 */
  Payment?: object
  /** 录音 */
  Record?: object
  /**
   * 安全网络
   * - 安全网络暂未支持离线打包，后续会提供离线打包的方案
   * @see https://doc.dcloud.net.cn/uniCloud/secure-network.html
   */
  SecureNetwork?: object
  /** SQLite数据库 */
  SQLite?: object
  /** 视频播放 */
  VideoPlayer?: object
  /**
   * Android X5 Webview(腾讯TBS)
   * - CPU类型配置不支持“x86”
   * @see https://uniapp.dcloud.net.cn/tutorial/app-android-x5.html
   */
  'Webview-x5'?: object
  /**
   * iOS UIWebview,
   * - 使用UIWebview模块后应用无法通过App Store审核
   * @see https://uniapp.dcloud.net.cn/tutorial/app-ios-uiwebview.html#uiwebview
   * @see https://nativesupport.dcloud.net.cn/AppDocs/usemodule/iOSModuleConfig/uiwebview.html
   */
  UIWebview?: object
}
export enum AppPlusOS {
  iOS = 'ios',
  Android = 'android',
}
export interface AppPlusDistributeSdkConfigs {
  oauth?: {
    /**
     * 微信授权登录
     * @see https://uniapp.dcloud.net.cn/tutorial/app-oauth-weixin.html
     */
    weixin?: {
      appid?: string
      UniversalLinks?: string
    }
    /**
     * 苹果登录
     * @see https://uniapp.dcloud.net.cn/tutorial/app-oauth-apple.html
     */
    apple?: object
    /**
     * uni一键登录
     */
    univerify?: {
      /**
       * GETUI_APPID与GY_APP_ID对[应开发者中心](https://dev.dcloud.net.cn/)一键登录->基础配置->一键登录应用ID（离线打包使用），GETUI_APPID与GY_APP_ID取值相同。
       */
      appid?: string
    }
    /**
     * QQ登录
     * @see https://uniapp.dcloud.net.cn/tutorial/app-oauth-qq.html
     */
    qq?: {
      appid?: string
      UniversalLinks?: string
    }
    /**
     * 新浪微博登录
     * @see https://uniapp.dcloud.net.cn/tutorial/app-oauth-weibo.html
     */
    sina?: {
      appkey?: string
      redirect_uri?: string
      UniversalLinks?: string
    }
    /**
     * Google登录
     * @see https://uniapp.dcloud.net.cn/tutorial/app-oauth-google.html
     */
    google?: {
      clientid?: string
    }
    /**
     * Facebook登录
     * @see https://uniapp.dcloud.net.cn/tutorial/app-oauth-facebook.html
     */
    facebook?: {
      appid?: string
      client_token?: string
      /**
       * Android端在4.31版本后Facebook登录SDK默认携带com.google.android.gms.permission.AD_ID权限，
       * 如未使用广告相关功能在GooglePlay上架时会遇到审核问题，需要手动删除掉此权限，[删除权限文档](https://uniapp.dcloud.net.cn/tutorial/app-nativeresource-android.html#removepermissions)
       */
      permission_ad_remove?: boolean
    }
    /**
     * 华为登录
     * @see https://uniapp.dcloud.net.cn/tutorial/app-oauth-huawei.html
     */
    huawei?: object
  }
  ad?: {
    config: {
      /** 开屏广告 */
      splash?: boolean
      adid?: string
      nvue?: boolean
    }
    /** 腾讯优量 */
    gdt?: object
    /** 快手广告联盟 */
    ks?: object
    /** 快手内容联盟 */
    'ks-content'?: object
    /** Sigmob广告联盟 */
    sigmob?: object
    /** 华为广告联盟 */
    hw?: object
    /** 百度百青藤广告联盟 */
    bd?: object
    /** Google AdMob谷歌广告 */
    gg?: object
    /** 海外穿山甲 */
    pg?: object
    /** Octopus章鱼移动广告 */
    zy?: object
    /** AdScope倍孜广告 */
    bz?: object
    /** 穿山甲GroMore */
    gm?: object
  }
  share?: {
    weixin?: {
      appid?: string
      UniversalLinks?: string
    }
    sina?: {
      appkey?: string
      redirect_uri?: string
      UniversalLinks?: string
    }
    qq?: {
      appid?: string
      UniversalLinks?: string
    }
  }
  /** 定位 */
  geolocation?: {
    /** OS自带的系统定位 */
    system?: {
      __platform__?: AppPlusOS[]
    }
    /** 高德定位 */
    amap?: {
      name?: string
      __platform__?: AppPlusOS[]
      appkey_ios?: string
      appkey_android?: string
    }
    /** 百度定位 */
    baidu?: {
      __platform__?: AppPlusOS[]
      appkey_ios?: string
      appkey_android?: string
    }
  }
  statics?: {
    umeng?: {
      appkey_ios?: string
      channelid_ios?: string
      appkey_android?: string
      channelid_android?: string
      google_play?: boolean
    }
    google?: {
      config_ios?: string
      config_android?: string
    }
  }
  push?: {
    unipush?: {
      offline?: boolean
      icons?: {
        small?: {
          ldpi?: string
          mdpi?: string
          hdpi?: string
          xhdpi?: string
          xxhdpi?: string
        }
      }
      /** 应用的app id/app key等信息，从开发者后台->unipush->配置管理->应用管理 界面查看 ** 注意：HBuilderX3.1.15之后需要添加GETUI_APPID属性 ** */
      appid?: string
      appkey?: string
      appsecret?: string
      hms?: {
        appid?: string
        config?: string
      }
      oppo?: {
        appkey?: string
        appsecret?: string
      }
      vivo?: {
        appid?: string
        appkey?: string
      }
      mi?: {
        appid?: string
        appkey?: string
      }
      version?: '2'
      meizu?: {
        appid?: string
        appkey?: string
      }
      honor?: {
        appid?: string
      }
      fcm?: {
        serverkey?: string
        channelid?: string
        config_ios?: string
        config_android?: string
      }
    }
  }
  maps?: {
    google?: {
      APIKey_ios?: string
      APIKey_android?: string
    }
    amap?: {
      name?: string
      appkey_ios?: string
      appkey_android?: string
      nvue?: boolean
    }
    baidu?: {
      appkey_ios?: string
      appkey_android?: string
    }
  }
  payment?: {
    appleiap?: object
    alipay?: {
      __platform__?: AppPlusOS[]
    }
    weixin?: {
      __platform__?: AppPlusOS[]
      appid?: string
      UniversalLinks?: string
    }
    paypal?: {
      __platform__?: AppPlusOS[]
      returnURL_ios?: string
      returnURL_android?: string
    }
    stripe?: {
      __platform__?: AppPlusOS[]
      returnURL_ios?: string
    }
    google?: object
  }
  speech?: {
    baidu?: {
      __platform__?: AppPlusOS[]
      appid_android?: string
      apikey_android?: string
      secretkey_android?: string
      appid_ios?: string
      apikey_ios?: string
      secretkey_ios?: string
    }
    xunfei?: {
      appid?: string
    }
  }
}
export interface AppPlusDistributeIOS {
  /**
   * 从3.1.10版本开始使用App离线SDK需要申请Appkey
   * @see https://nativesupport.dcloud.net.cn/AppDocs/usesdk/appkey.html
   */
  dcloud_appkey?: string
  /** iOS平台云端打包使用的Bundle ID */
  appid?: string
  /** iOS平台云端打包使用的profile文件路径 */
  mobileprovision?: string
  /** iOS平台云端打包使用的证书文件路径 */
  p12?: string
  /** iOS打包使用的证书密码 */
  password?: string
  /** iOS支持的设备类型，可取值iphone（仅支持iPhone设备）、ipad（仅支持iPad设备）、universal（同时支持iPhone和iPad设备） */
  devices?: string
  /** 应用访问白名单列表，多个白名单使用“,”分割，详情参考：iOS设置应用访问白名单 */
  urlschemewhitelist?: string
  /** Android平台App注册的scheme，多个scheme使用“,”分割，详情参考：iOS设置应用UrlSchemes */
  urltypes?: string
  /** 应用后台运行模式，详情参考：[iOS设置应用后台运行能力](https://uniapp.dcloud.io/tutorial/app-ios-uibackgroundmodes) */
  UIBackgroundModes?: string
  /**
   * @deprecated
   * 依赖的系统库，已废弃，推荐使用uni原生插件扩展使用系统依赖库 */
  frameworks?: string[]
  /** iOS支持的最低版本 */
  deploymentTarget?: string
  /** iOS隐私信息访问的许可描述 */
  privacyDescription?: {
    /** 可选，字符串类型，系统相册读取权限描述 */
    NSPhotoLibraryUsageDescription?: string
    /** 可选，字符串类型，系统相册写入权限描述 */
    NSPhotoLibraryAddUsageDescription?: string
    /** 可选，字符串类型，摄像头使用权限描述 */
    NSCameraUsageDescription?: string
    /** 可选，字符串类型，麦克风使用权限描述 */
    NSMicrophoneUsageDescription?: string
    /** 可选，字符串类型，运行期访问位置权限描述 */
    NSLocationWhenInUseUsageDescription?: string
    /** 可选，字符串类型，后台运行访问位置权限描述 */
    NSLocationAlwaysUsageDescription?: string
    /** 可选，字符串类型，运行期后后台访问位置权限描述 */
    NSLocationAlwaysAndWhenInUseUsageDescription?: string
    /** 可选，字符串类型，使用日历权限描述 */
    NSCalendarsUsageDescription?: string
    /** 可选，字符串类型，使用通讯录权限描述 */
    NSContactsUsageDescription?: string
    /** 可选，字符串类型，使用蓝牙权限描述 */
    NSBluetoothPeripheralUsageDescription?: string
    /** 可选，字符串类型，后台使用蓝牙权限描述 */
    NSBluetoothAlwaysUsageDescription?: string
    /** 可选，字符串类型，系统语音识别权限描述 */
    NSSpeechRecognitionUsageDescription?: string
    /** 可选，字符串类型，系统提醒事项权限描述 */
    NSRemindersUsageDescription?: string
    /** 可选，字符串类型，使用运动与健康权限描述 */
    NSMotionUsageDescription?: string
    /** 可选，字符串类型，使用健康更新权限描述 */
    NSHealthUpdateUsageDescription?: string
    /** 可选，字符串类型，使用健康分享权限描述 */
    NSHealthShareUsageDescription?: string
    /** 可选，字符串类型，使用媒体资料库权限描述 */
    NSAppleMusicUsageDescription?: string
    /** 可选，字符串类型，使用NFC权限描述 */
    NFCReaderUsageDescription?: string
    /** 可选，字符串类型，访问临床记录权限描述 */
    NSHealthClinicalHealthRecordsShareUsageDescription?: string
    /** 可选，字符串类型，访问HomeKit权限描述 */
    NSHomeKitUsageDescription?: string
    /** 可选，字符串类型，访问Siri权限描述 */
    NSSiriUsageDescription?: string
    /** 可选，字符串类型，使用FaceID权限描述 */
    NSFaceIDUsageDescription?: string
    /** 可选，字符串类型，访问本地网络权限描述 */
    NSLocalNetworkUsageDescription?: string
    /** 可选，字符串类型，跟踪用户活动权限描述 */
    NSUserTrackingUsageDescription?: string
  }
  /** 是否使用广告标识 */
  idfa?: boolean
  /** 应用的能力配置（Capabilities） */
  capabilities?: {
    entitlements: object
    plists: object
  }
  /** 应用的CFBundleName名称，默认值为HBuilder */
  CFBundleName?: string
  /** 编译时支持的CPU指令，可取值arm64、arm64e、armv7、armv7s、x86_64 */
  validArchitectures?: ('arm64' | 'arm64e' | 'armv7' | 'armv7s' | 'x86_64')[]
  /** 使用“Push(消息推送)”模块时申请系统推送权限模式，设置为manual表示调用push相关API时申请，设置为其它值表示应用启动时自动申请 */
  pushRegisterMode?: string
  /** 设置为manual表示同意隐私政策后再获取相关隐私信息，设置为其它值表示应用启动时自动获取详见 */
  privacyRegisterMode?: string
}
export interface AppPlus {
  /** 编译器兼容性配置 */
  compatible?: {
    /** 是否忽略运行环境与编译环境不一致的问题 */
    ignoreVersion?: boolean
    /**
     * 运行环境版本号
     * 可以使用英文逗号分割
     */
    runtimeVersion?: string
    /** 编译环境版本号 */
    compilerVersion?: string
  }
  /** 启动界面信息 */
  splashscreen?: {
    /**
     * 是否等待首页渲染完毕后再关闭启动界面
     * 默认为 true
     */
    alwaysShowBeforeRender?: boolean
    /**
     * 是否自动关闭启动界面
     * 默认为 true
     */
    autoclose?: boolean
    /**
     * 是否在程序启动界面显示加载
     * 默认为 true
     */
    waiting?: boolean
    /** 是否使用原生提示框 */
    useOriginalMsgbox?: boolean
    /**
     * 未知属性，但是uni默认配置中有该属性
     */
    delay?: number
  }
  /** 重力感应、横竖屏配置 */
  screenOrientation?: ('portrait-primary' | 'portrait-secondary' | 'landscape-primary' | 'landscape-secondary')[]
  /** APP 权限模块 */
  modules?: AppPlusModules
  /** APP 发布信息 */
  distribute?: {
    /** Android 专用配置 */
    android?: AppPlusDistributeAndroid
    /** iOS 专用配置 */
    ios?: AppPlusDistributeIOS
    /**
     * App图标配置
     *
     * @see https://uniapp.dcloud.net.cn/tutorial/app-icons.html#%E4%BA%91%E7%AB%AF%E6%89%93%E5%8C%85
     *
     * 注意事项：
     *
     * - 必须使用png格式，其它格式需要使用图片工具转换，注意不要直接将jpg等其它格式图片直接改名为png
     * - 系统没有对图标分辨率进行限制，按照建议的分辨率配置即可
     * - 图片支持透明区域，建议使用圆角图标
     */
    icons?: AppPlusIcons
    /**
     * SDK 配置
     * 仅打包生效
     */
    sdkConfigs?: AppPlusDistributeSdkConfigs
    /**
     * Android使用原生隐私政策提示框
     *
     * @see https://uniapp.dcloud.net.cn/tutorial/app-privacy-android.html#
     */
    splashscreen?: {
      useOriginalMsgbox?: boolean
    }
  }
  /**
   * nvue 编译模式
   * 默认为 weex
   * 建议使用 uni-app
   */
  nvueCompiler?: 'weex' | 'uni-app'
  /**
   * nvue 样式编译模式
   * 默认为 weex
   * 建议使用 uni-app
   */
  nvueStyleCompiler?: 'weex' | 'uni-app'
  /** 运行框架 */
  renderer?: 'native'
  /**
   * nvue 首页启动模式
   * 默认为 normal
   */
  nvueLaunchMode?: 'normal' | 'fast'
  /** nvue 页面布局初始配置 */
  nvue?: {
    /**
     * flex 项目的排列方向
     * 默认为 column
     */
    'flex-direction'?: 'row' | 'row-reverse' | 'column' | 'column-reverse'
  }
  /** uni 统计配置项 */
  uniStatistics?: SimpleUniStatistics
  /** 优化配置 */
  optimization?: {
    /**
     * 是否开启分包配置
     * 为 true 时必须设置 app-plus.runmode 为 liberate
     */
    subPackages?: boolean
  }
  /**
   * 运行模式
   * 分包时必须设置 liberate
   */
  runmode?: 'normal' | 'liberate'
  /**
   * 系统 webview 低于指定版本时，会弹出提示，或者下载 x5 内核后继续启动
   * Android 支持
   */
  webView?: {
    /**
     * 最小 webview 版本
     * 当低于最小版本要求时，显示弹框提示，点击确定退出应用
     */
    minUserAgentVersion?: string
    /**
     * x5 内核配置
     * 启用 Android X5 Webview 模块后生效
     */
    x5?: {
      /**
       * 超时时间
       * 默认为 3000
       */
      timeOut?: number
      /**
       * 是否在非 WiFi 网络环境时弹框询问用户是否确认下载 X5 内核
       * 默认为 false，即不弹框询问
       */
      showTipsWithoutWifi?: boolean
      /**
       * 是否允许用户在非 WiFi 网络时直接下载 X5 内核
       * 默认为 false，此时 showTipsWithoutWifi 为 true 时弹框询问用户，showTipsWithoutWifi 为 false 时不下载
       * true 时不弹框询问用户
       */
      allowDownloadWithoutWiFi?: boolean
    }
  }
  [x: string]: unknown
}
export interface H5 {
  /**
   * 页面标题
   * 默认使用顶层 name 字段
   */
  title?: string
  /** 相对于应用根目录的 index.html 模板路径 */
  template?: string
  /** 路由设置 */
  router?: {
    /**
     * 路由跳转模式
     * 默认为 hash
     */
    mode?: 'hash' | 'history'
    /**
     * 应用基础路径
     * 默认为 /
     */
    base?: string
  }
  /** 加载相关设置 */
  async?: {
    /**
     * 页面 JavaScript 加载时使用的组件，需注册为全局组件
     * 默认为 AsyncLoading
     */
    loading?: string
    /**
     * 页面 JavaScript 加载失败时使用的组件，需注册为全局组件
     * 默认为 AsyncError
     */
    error?: string
    /**
     * 显示加载中组件的延时时间，如果在延时内加载完成，则不会显示加载中组件
     * 单位为 ms
     * 默认为 200
     *
     */
    delay?: number
    /**
     * 加载超时时间，如果超时，则显示加载失败组件
     * 单位为 ms
     * 默认为 60000
     */
    timeout?: number
  }
  /**
   * dev server 设置
   */
  devServer?: {
    /**
     * 是否启用 HTTPS 协议
     * 默认为 false
     */
    https?: boolean
    /**
     * 是否禁用 host 检查
     * 默认为 false
     */
    disableHostCheck?: boolean
  }
  /** 引用资源的地址前缀，仅发布时生效 */
  publicPath?: string
  /** SDK 配置  */
  sdkConfigs?: Record<string, never>
  /** 优化配置 */
  optimization?: {
    /**
     * 资源预获取
     * 默认为 false
     */
    prefetch?: boolean
    /**
     * 资源预加载
     * 默认为 false
     */
    preload?: boolean
    /** 摇树优化 */
    treeShaking?: {
      /**
       * 是否开启摇树优化
       * 默认为 false
       */
      enable?: boolean
    }
  }
  /** uni 统计配置项 */
  uniStatistics?: SimpleUniStatistics
  [x: string]: unknown
}
export interface QuickappWebview {
  /** 应用图标，推荐尺寸 192x192 */
  icon?: string
  /** 应用包名 */
  package?: string
  /** 最小平台支持，快应用联盟最低 1063，快应用华为最低 1070 */
  minPlatformVersion?: number
  /** 版本名称 */
  versionName?: string
  /** 版本号 */
  versionCode?: number
  [x: string]: unknown
}
export interface QuickappWebviewUnion {
  /** 最小平台支持，最低 1063 */
  minPlatformVersion?: number
}
export interface QuickappWebviewHuawei {
  /** 最小平台支持，最低 1070 */
  minPlatformVersion?: number
}
export interface MpWeixin {
  /** 微信小程序的 appid */
  appid?: string
  /**
   * 微信小程序项目设置
   * 更多信息查看 <https://developers.weixin.qq.com/miniprogram/dev/devtools/projectconfig.html>
   */
  setting?: {
    /** 是否启用 ES6 转 ES5 */
    es6?: boolean
    /**
     * 是否使用增强编译
     *
     * {@see https://developers.weixin.qq.com/community/develop/doc/0002ce07a58000a57c5da5e6456c09 regeneratorRuntime 相关报错排查指引}
     */
    es7?: boolean
    /** 是否使用增强编译 */
    enhance?: boolean
    /** 上传代码时样式是否自动补全  */
    postcss?: boolean
    /** 上传代码时是否自动压缩脚本文件 */
    minified?: boolean
    /** 上传代码时是否自动压缩样式文件 */
    minifyWXSS?: boolean
    /** 上传代码时是否自动压缩 WXML 文件 */
    minifyWXML?: boolean
    /** 上传时是否代码保护 */
    uglifyFileName?: boolean
    /** 上传时是否过滤无依赖文件 */
    ignoreUploadUnusedFiles?: boolean
    /** 是否自动运行体验评分 */
    autoAudits?: boolean
    /** 是否检查安全域名和 TLS 版本 */
    urlCheck?: boolean
    /** 是否启用代码自动热重载 */
    compileHotReLoad?: boolean
    /** 是否启用数据预拉取 */
    preloadBackgroundData?: boolean
    /** 是否启用懒注入占位组件调试 */
    lazyloadPlaceholderEnable?: boolean
    /** 小游戏项目有效，是否开启静态资源服务器 */
    useStaticServer?: boolean
    /** 预览及真机调试的时主包、分包体积上限是否调整为小程序 4M、小游戏 8M */
    bigPackageSizeSupport?: boolean
    /** 增强编译 Babel 的配置项 */
    babelSetting?: {
      /**
       * Babel 辅助函数的输出目录
       * 默认为 `@babel/runtime`
       */
      outputPath?: string
      /** 需要跳过 Babel 编译（包括代码压缩）处理的文件或目录 */
      ignore?: string[]
    }
    /** 编译插件配置 */
    useCompilerPlugins?: false | string[]
    /** 将 JS 编译成 ES5 时，是否禁用严格模式 */
    disableUseStrict?: boolean
    /**
     * 上传时是否带上 sourcemap
     * 默认为 true
     */
    uploadWithSourceMap?: boolean
    /** 在小游戏插件项目中，是否启用 以本地目录为插件资源来源 特性 */
    localPlugins?: boolean
    /** 是否手动配置构建 npm 的路径 */
    packNpmManually?: boolean
    /** 仅 packNpmManually 为 true 时生效 */
    packNpmRelationList?: {
      /** node_modules 源对应的 package.json */
      packageJsonPath?: string
      /** node_modules 的构建结果目标位置 */
      miniprogramNpmDistDir?: string
    }[]
    /** 是否使用工具渲染 CoverView */
    coverView?: boolean
    /**
     * 预览、真机调试和本地模拟器等开发阶段是否过滤无依赖文件
     * 默认为 true
     */
    ignoreDevUnusedFiles?: boolean
    /** 是否检查键名 */
    checkInvalidKey?: boolean
    /** 是否开启调试器 WXML 面板展示 shadow-root */
    showShadowRootInWxmlPanel?: boolean
    /** 是否开启小程序独立域调试特性 */
    useIsolateContext?: boolean
    /**
     * 是否开启模拟器预先载入小程序的某些资源
     * 设置为 false 时会导致 useIsolateContext 失效
     */
    useMultiFrameRuntime?: boolean
    /** 是否启用 API Hook 功能 */
    useApiHook?: boolean
    /** 是否在额外的进程处理一些小程序 API */
    useApiHostProcess?: boolean
    /** 小游戏有效，是否开启局域网调试服务器 */
    useLanDebug?: boolean
    /** 是否在游戏引擎项目中开启支持引用 node 原生模块的底层加速特性 */
    enableEngineNative?: boolean
    /** 是否在本地设置中展示传统的 ES6 转 ES5 开关（对应 es6），增强编译开关 （对应 enhance） */
    showES6CompileOption?: boolean
    /** 是否检查 SiteMap 索引 */
    checkSiteMap?: boolean
  }
  /**
   * 是否启用插件功能页
   * 默认为 false
   */
  functionalPages?: boolean
  /** 需要在后台使用的能力 */
  requiredBackgroundModes?: ('audio' | 'location')[]
  /** 使用到的插件 */
  plugins?: Record<string, never>
  /**
   * 是否支持 iPad 上屏幕旋转
   * 默认为 false
   */
  resizable?: boolean
  /** 需要跳转的微信小程序列表 */
  navigateToMiniProgramAppIdList?: string[]
  /** 接口权限设置 */
  permission?: Record<string, never>
  /** Worker 代码目录 */
  workers?: string
  /** 优化配置 */
  optimization?: {
    /** 是否开启分包优化 */
    subPackages?: boolean
  }
  /** 云开发代码目录 */
  cloudfunctionRoot?: string
  /** uni 统计配置项 */
  uniStatistics?: SimpleUniStatistics
  /**
   * Vue2 作用域插槽编译模式
   * 默认为 auto
   */
  scopedSlotsCompiler?: 'auto' | 'legacy' | 'augmented'
  /**
   * 是否合并组件虚拟节点外层属性
   * 目前仅支持 style、class 属性
   */
  mergeVirtualHostAttributes?: boolean
  /** 要半屏跳转的小程序 appid */
  embeddedAppIdList?: string[]
  /** 地理位置相关接口 */
  requiredPrivateInfos?: string[]
  /** 目前仅支持值 requiredComponents，代表开启小程序按需注入特性 */
  lazyCodeLoading?: 'requiredComponents'
  [x: string]: unknown
}
export interface MpAlipay {
  /** 使用到的插件 */
  plugins?: Record<string, never>
  /**
   * 是否启用 component2 编译
   * 默认为 true
   */
  component2?: boolean
  /**
   * 是否启用小程序基础库 2.0 构建
   * 默认为 true
   */
  enableAppxNg?: boolean
  /**
   * 是否开启 axml 严格语法检查
   * 默认为 false
   */
  axmlStrictCheck?: boolean
  /**
   * 是否启用多进程编译
   * 默认为 false
   */
  enableParallelLoader?: boolean
  /**
   * 是否压缩编译产物，仅在真机预览/真机调试时生效
   * 默认为 false
   */
  enableDistFileMinify?: boolean
  /** uni 统计配置项 */
  uniStatistics?: SimpleUniStatistics
  /**
   * Vue2 作用域插槽编译模式
   * 默认为 auto
   */
  scopedSlotsCompiler?: 'auto' | 'legacy' | 'augmented'
  /**
   * 是否合并组件虚拟节点外层属性
   * 目前仅支持 style、class 属性
   */
  mergeVirtualHostAttributes?: boolean
  /** 目前仅支持值 requiredComponents，代表开启小程序按需注入特性 */
  lazyCodeLoading?: 'requiredComponents'
  [x: string]: unknown
}
export interface MpBaidu {
  /** 百度小程序的 appid */
  appid?: string
  /** 需要在后台使用的能力 */
  requiredBackgroundModes?: 'audio'[]
  /** 预请求的所有 url 的列表 */
  prefetches?: string[]
  /** 优化配置 */
  optimization?: {
    /** 是否开启分包优化 */
    subPackages?: boolean
  }
  /** uni 统计配置项 */
  uniStatistics?: SimpleUniStatistics
  /**
   * Vue2 作用域插槽编译模式
   * 默认为 auto
   */
  scopedSlotsCompiler?: 'auto' | 'legacy' | 'augmented'
  [x: string]: unknown
}
export interface MpToutiao {
  /** 字节跳动小程序的 appid */
  appid?: string
  /** 字节跳动小程序小程序项目设置 */
  setting?: {
    /** 是否启用 ES6 转 ES5 */
    es6?: boolean
    /** 上传代码时样式是否自动补全 */
    postcss?: boolean
    /** 上传代码时是否自动压缩脚本文件 */
    minified?: boolean
    /** 是否检查安全域名和 TLS 版本 */
    urlCheck?: boolean
    /** 修改文件的时候是否自动编译 */
    autoCompile?: boolean
    /** 下次编译是否模拟更新 */
    mockUpdate?: boolean
    /** 是否启动自定义处理命令 */
    scripts?: boolean
    /** 是否开启宿主登录模拟 */
    mockLogin?: boolean
  }
  /** 需要跳转的字节跳动小程序列表 */
  navigateToMiniProgramAppIdList?: string[]
  /** 优化配置 */
  optimization?: {
    /** 是否开启分包优化 */
    subPackages?: boolean
  }
  /** uni 统计配置项 */
  uniStatistics?: SimpleUniStatistics
  /**
   * Vue2 作用域插槽编译模式
   * 默认为 auto
   */
  scopedSlotsCompiler?: 'auto' | 'legacy' | 'augmented'
  [x: string]: unknown
}
export interface MpLark {
  /** 飞书小程序的 appid */
  appid?: string
  /** 飞书小程序小程序项目设置 */
  setting?: {
    /** 是否启用 ES6 转 ES5 */
    es6?: boolean
    /** 是否启用脚本代码自动压缩 */
    minified?: boolean
    /** 是否启用样式自动补全 */
    postcss?: boolean
    /** 是否检查安全域名和 TLS 版本 */
    urlCheck?: boolean
    /** Babel 的配置项 */
    babelSetting?: {
      /** 需要跳过 Babel 编译（包括代码压缩）处理的文件或目录 */
      ignore?: string[]
    }
  }
  /** uni 统计配置项 */
  uniStatistics?: SimpleUniStatistics
  /**
   * Vue2 作用域插槽编译模式
   * 默认为 auto
   */
  scopedSlotsCompiler?: 'auto' | 'legacy' | 'augmented'
  [x: string]: unknown
}
export interface MpQq {
  /** QQ 小程序的 appid */
  appid?: string
  /** 需要在后台使用的能力 */
  requiredBackgroundModes?: 'audio'[]
  /** 需要跳转的 QQ 小程序列表 */
  navigateToMiniProgramAppIdList?: string[]
  /** 接口权限设置 */
  permission?: Record<string, never>
  /** Worker 代码目录 */
  workers?: string
  /** 需要打开群资料卡的群号列表 */
  groupIdList?: string[]
  /** 优化配置 */
  optimization?: {
    /** 是否开启分包优化 */
    subPackages?: boolean
  }
  /** uni 统计配置项 */
  uniStatistics?: SimpleUniStatistics
  /**
   * Vue2 作用域插槽编译模式
   * 默认为 auto
   */
  scopedSlotsCompiler?: 'auto' | 'legacy' | 'augmented'
  [x: string]: unknown
}
export interface MpKuaishou {
  /** 快手小程序的 appid */
  appid?: string
  /** 优化配置 */
  optimization?: {
    /** 是否开启分包优化 */
    subPackages?: boolean
  }
  /** uni 统计配置项 */
  uniStatistics?: SimpleUniStatistics
  /**
   * Vue2 作用域插槽编译模式
   * 默认为 auto
   */
  scopedSlotsCompiler?: 'auto' | 'legacy' | 'augmented'
  [x: string]: unknown
}
export interface ManifestConfig {
  /** 应用名称，安装 APP 后显示的名称 */
  name?: string
  /**
   * 应用标识，由 DCloud 云端分配
   * 更多信息查看 <https://ask.dcloud.net.cn/article/35907>
   */
  appid?: string
  /** 应用描述 */
  description?: string
  /**
   * 当前默认语言
   * 默认为 auto
   */
  locale?: string
  /** 版本名称，在云打包和生成 wgt 资源时使用 */
  versionName?: string
  /** 版本号 */
  versionCode?: number
  /**
   * 是否转换 px 为 rpx
   * 默认为 true
   * 建议使用 false
   */
  transformPx?: boolean
  /** 网络超时时间 */
  networkTimeout?: NetworkTimeout
  /**
   * 是否开启 debug 模式
   * 默认为 false
   */
  debug?: boolean
  /**
   * uni 统计配置
   * 更多信息查看 <https://uniapp.dcloud.net.cn/uni-stat-v1.html> 和 <https://uniapp.dcloud.net.cn/uni-stat-v2.html>
   */
  uniStatistics?: UniStatistics
  /** APP 特有配置 */
  'app-plus'?: AppPlus
  channel_list?: { id: string; name?: string }[]
  /** H5 特有配置 */
  h5?: H5
  /** 快应用特有配置 */
  'quickapp-webview'?: QuickappWebview
  /** 快应用联盟特有配置 */
  'quickapp-webview-union'?: QuickappWebviewUnion
  /** 快应用华为特有配置 */
  'quickapp-webview-huawei'?: QuickappWebviewHuawei
  /** 微信小程序特有配置 */
  'mp-weixin'?: MpWeixin
  /** 支付宝小程序特有配置 */
  'mp-alipay'?: MpAlipay
  /** 百度小程序特有配置 */
  'mp-baidu'?: MpBaidu
  /** 字节跳动小程序特有配置 */
  'mp-toutiao'?: MpToutiao
  /** 飞书小程序特有配置 */
  'mp-lark'?: MpLark
  /** QQ 小程序特有配置 */
  'mp-qq'?: MpQq
  /** 快手小程序特有配置 */
  'mp-kuaishou'?: MpKuaishou
  [x: string]: unknown
}
