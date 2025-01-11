import type { AndroidAbiFilters, ValidArchitectures } from './manifest.config.js'

export interface NativePluginPackage {
  name?: string
  id?: string
  version?: string
  description?: string
  _dp_type: 'nativeplugin'
  _dp_nativeplugin?: {
    android?: NativePluginAndroid
    ios?: NativePluginIOS
  }
}

export interface NativePluginItem {
  /** 必填, 根据插件类型选择 */
  type?: 'module' | 'component'
  /**
   * 必填, 注册插件的名称,
   * 注意：module 的 name 必须以插件id为前缀或和插件id相同，
   * 比如 `DCTestUniPlugin-TestModule`，
   * 其中 DCTestUniPlugin 为插件的id，
   * 避免与其他插件冲突，component 的 name 没有强制要求，
   * 但是也要保证唯一比如 `dc-map`
   */
  name?: string
  /** 必填, 注册插件的类名 */
  class?: string
}

export interface NativePluginAndroid {
  plugins?: NativePluginItem[]
  /** 可选, 事件钩子注册类名 */
  hooksClass?: string
  /** 必填, 可取值aar|jar */
  integrateType?: 'aar' | 'jar'
  /** 可选, 依赖的库名称 */
  dependencies?: string[]
  /**
   * 可选，需要排除的HX内置模块依赖库名称
   * HBuilderX3.1.18+支持：
   * 仅在插件与HX内置模块依赖库存在冲突时可能需要，
   * 使用前请在官方QQ交流群“DCloud原生开发者群”中联系管理员确认
   */
  excludeDependencies?: string[]
  /** 可选，Java编译参数配置 */
  compileOptions?: Record<string, string>
  /** 可选, 支持的abi类型, 可取值armeabi-v7a|arm64-v8a|x86 */
  abis?: AndroidAbiFilters[]
  /** 可选，支持的Android最低版本，如21 */
  minSdkVersion?: number
  /**
   * @deprecated
   * 可选，是否兼容使用AndroidX  3.2.5+版本后废弃该属性
   */
  useAndroidX?: boolean
  /** 可选, 要使用的Android权限列表 */
  permissions?: string[]
  /** 插件需要配置的参数名称, 如appid */
  parameters?: Record<
    string,
    {
      /** 参数的描述信息： 可选，在HBuilderX中manifest.json的可视化界面中显示，用于提示插件使用者配置此参数的作用。 */
      des?: string
      /**
       * 云端打包时meta-data节点的android:name属性值：
       * 可选，与placeholder二选一配置。
       * 此值为AndroidManifest.xml中添加meta-data节点的android:name属性值，
       * 推荐使用“插件标识_ 键名”格式，
       * 如"DCloud-HelloPlugin_appid"。
       */
      key?: string
      /**
       * HBuilderX2.5.6+版本支持：
       * 可选，与key二选一配置。
       * 此值为在build.gradle中添加manifestPlaceholders的键名，
       * 为了避免与其它插件冲突推荐使用“插件标识_键名”格式，
       * 如"DCloud-HelloPlugin_appid"。
       */
      placeholder?: string
      /**
       * 云端打包时格式化的键值：
       * 可选，如果需要对插件使用者输入的参数值做一些格式化处理
       * （如添加固定的前缀或后缀）时才需要配置vlue字段。
       * 其中${appid_android}表示插件使用者输入的appid_android参数值；
       * 不配置此字段则键值为插件使用者配置的参数值。
       */
      value?: string
    }
  >
}

export interface NativePluginIOS {
  plugins?: NativePluginItem[]
  /** 必填, 可取值framework|library */
  integrateType?: 'framework' | 'library'
  /** 可选, 事件钩子注册类名 */
  hooksClass?: string
  /**
   * 依赖的系统库(系统库有.framework和.tbd和.dylib类型)，
   * 和第三方.framework动态库;
   * （.a 库或 .framework**静态库**直接放到ios根目录即可，不需要配置）
   */
  frameworks?: string[]
  /**
   * 依赖的.framework动态库（
   * 注意.framework动态库也需要在上面的 frameworks 节点添加配置，
   * 同样将动态库.framework文件放到 ios 目录）
   */
  embedFrameworks?: string[]
  /**
   * 配置应用的capabilities数据
   * （根据XCode规范分别配置到entitlements和plist文件中）
   */
  capabilities?: {
    /**
     * 合并到工程entitlements文件的数据（json格式）
     */
    entitlements?: object
    /** 合并到工程Info.plist文件的数据（json格式） */
    plists?: object
  }
  /**
   * 自定义配置工程Info.plist文件的数据（json格式），
   * 优先级高于capabilities->plists
   */
  plists?: object
  /**
   * HBuilderX2.3.4及以上版本支持
   * 可选，插件要使用的xcassets文件列表，相对于ios目录的路径
   */
  assets?: string[]
  /**
   * 可选, 插件使用到的隐私列表，如NSPhotoLibraryUsageDescription
   */
  privacies?: string[]
  /**
   * 开启 swift 编译支持，如果插件使用了 swift 需要配置此项
   */
  embedSwift?: boolean
  /**
   * 8.0, 可选，注意：使用 Xcode14 需配置为 "11.0"
   */
  deploymentTarget?: string
  /**
   * 可选，支持的CPU架构类型
   * 支持多个值，可取值："arm64", "armv7"，
   * 注意：使用 Xcode14 需要配置为 “arm64”
   */
  validArchitectures?: ValidArchitectures[]
  parameters?: Record<
    string,
    {
      /**
       * 参数的描述信息： 可选，在HBuilderX中manifest.json的可视化界面中显示，用于提示插件使用者配置此参数的作用。
       */
      des?: string
      /**
       * 云端打包时原生层使用的键名称： 必填，用于定义参数值在Info.plist文件中保存的键名。 如果需要多层级嵌套可使用:分割，推荐使用“插件标识:键名”格式，如"DC-XXX:appid"。
       */
      key?: string
      /**
       * 云端打包时格式化的键值： 可选，如果需要对插件使用者输入的参数值做一些格式化处理（如添加固定的前缀或后缀）时才需要配置vlue字段。 其中${appid_ios}表示插件使用者输入的appid_ios参数值；不配置此字段则键值为插件使用者输入的参数值。
       */
      value?: string
    }
  >
  /**
   * 可选, 插件要使用的资源文件列表，相对于ios目录的路径 ，HX 3.2.0+ 版本不在推荐使用，请参考文档下面的 “依赖资源文件” 说明
   */
  resources?: string[]
}
