/**
 * app.json5
 * @link https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/app-configuration-file-V5
 */

export interface AppJson {
  app: App
}

export interface App {
  /**
   * 标识应用的Bundle名称，用于标识应用的唯一性。命名规则如下 ：
   * - 由字母、数字、下划线和符号“.”组成，且必须以字母开头。
   * - 字符串最小长度为7字节，最大长度128字节。
   * - 推荐采用反域名形式命名（如“com.example.demo”，建议第一级为域名后缀com，第二级为厂商/个人名，第三级为应用名，也可以多级）。
   *
   * 对于随系统源码编译的应用，建议命名为“com.ohos.demo”形式，其中的ohos标识系统应用。
   */
  bundleName: string
  /**
   * 标识应用的Bundle类型，用于区分应用或者元服务。
   * @default 'app'
   */
  bundleType?: AppBundleType
  /**
   * 标识应用是否可调试。
   * - true：可调试，一般用于开发阶段。
   * - false：不可调试，一般用于发布阶段。
   * @default false
   */
  debug?: boolean
  /**
   * 标识[应用的图标](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/application-component-configuration-stage-V5)，
   * 取值为图标资源文件的索引。
   */
  icon: string
  /**
   * 标识[应用的名称](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/application-component-configuration-stage-V5)，
   * 取值为字符串资源的索引，字符串长度不超过63字节。
   */
  label: string
  /**
   * 标识应用的描述信息。取值为长度不超过255字节的字符串，内容为描述信息的字符串资源索引。
   */
  description?: string
  /**
   * 标识对应用开发厂商的描述，取值为长度不超过255字节的字符串。
   */
  vendor?: string
  /**
   * 标识应用的版本号，取值为小于2^31次方的正整数。此数字仅用于确定某个版本是否比另一个版本更新，数值越大表示版本越高。
   * 开发者可以将该值设置为任何正整数，但是必须确保应用的新版本都使用比旧版本更大的值。
   */
  versionCode: number
  /**
   * 标识向用户展示的应用版本号。
   * 取值为长度不超过127字节的字符串，仅由数字和点构成，推荐采用“A.B.C.D”四段式的形式。四段式推荐的含义如下所示。
   * - 第一段：主版本号/Major，范围0~99，重大修改的版本，如实现新的大功能或重大变化。
   * - 第二段：次版本号/Minor，范围0~99，表示实现较突出的特点，如新功能添加或大问题修复。
   * - 第三段：特性版本号/Feature，范围0~99，标识规划的新版本特性。
   * - 第四段：修订版本号/Patch，范围0~999，表示维护版本，如修复bug。
   */
  versionName: string
  /**
   * 标识应用能够兼容的最低历史版本号，用于应用跨设备兼容性判断。取值范围为0~2147483647。
   * @default $versionCode
   */
  minCompatibleVersionCode?: number
  /**
   * 标识应用运行需要的SDK的API最小版本。取值范围为0~2147483647。
   *
   * 应用编译构建时由build-profile.json5中的compatibleSdkVersion自动生成。
   */
  minAPIVersion: number
  /**
   * 标识应用运行需要的API目标版本。取值范围为0~2147483647。
   *
   * 应用编译构建时由build-profile.json5中的compileSdkVersion自动生成。
   */
  targetAPIVersion: number
  /**
   * 标识应用运行需要的API目标版本的类型，采用字符串类型表示。取值为“CanaryN”、“BetaN”或者“Release”，其中，N代表大于零的整数。
   * - Canary：受限发布的版本。
   * - Beta：公开发布的Beta版本。
   * - Release：公开发布的正式版本。
   *
   * 应用编译构建时根据当前使用的SDK的Stage自动生成。即便手动配置了取值，编译构建时也会被覆盖。
   */
  apiReleaseType?: string
  /**
   * 标识应用是否能访问应用的安装目录，仅针对Stage模型的系统应用和预置应用生效。
   * @default false
   */
  accessible?: boolean
  /**
   * 标识当前工程是否支持多个工程的联合开发。
   * - true：当前工程支持多个工程的联合开发。多工程开发可参考[多工程构建](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/ide-hvigor-multi-projects-0000001819424365-V5)。
   * - false：当前工程不支持多个工程的联合开发。
   * @default false
   */
  multiProjects?: boolean
  /**
   * 标识应用程序是否开启asan检测，用于辅助定位buffer越界造成的crash问题。
   * - true：当前工程开启asan检测。
   * - false：当前工程不开启asan检测。
   * @default false
   */
  asanEnabled?: boolean
  /**
   * 标识对tablet设备做的特殊配置，可以配置的属性字段有上文提到的：minAPIVersion。
   * 如果使用该属性对tablet设备做了特殊配置，则应用在tablet设备中会采用此处配置的属性值，并忽略在app.json5公共区域配置的属性值。
   */
  tablet?: DeviceConfig
  /**
   * 标识对tv设备做的特殊配置，可以配置的属性字段有上文提到的：minAPIVersion。
   * 如果使用该属性对tv设备做了特殊配置，则应用在tv设备中会采用此处配置的属性值，并忽略在app.json5公共区域配置的属性值。
   */
  tv?: DeviceConfig
  /**
   * 标识对wearable设备做的特殊配置，可以配置的属性字段有上文提到的：minAPIVersion。
   * 如果使用该属性对wearable设备做了特殊配置，则应用在wearable设备中会采用此处配置的属性值，并忽略在app.json5公共区域配置的属性值。
   */
  wearable?: DeviceConfig
  /**
   * 标识对car设备做的特殊配置，可以配置的属性字段有上文提到的：minAPIVersion。
   * 如果使用该属性对car设备做了特殊配置，则应用在car设备中会采用此处配置的属性值，并忽略在app.json5公共区域配置的属性值。
   */
  car?: DeviceConfig
  /**
   * 标识对default设备做的特殊配置，可以配置的属性字段有上文提到的：minAPIVersion。
   * 如果使用该属性对default设备做了特殊配置，则应用在default设备中会采用此处配置的属性值，并忽略在app.json5公共区域配置的属性值。
   */
  default?: DeviceConfig
  /**
   * 标识当前包所指定的目标应用, 标签值的取值规则和范围与bundleName标签一致。
   * 配置该字段的应用为具有overlay特征的应用。
   */
  targetBundleName?: string
  /**
   * 标识当前应用的优先级，取值范围为1~100。
   * 配置targetBundleName字段之后，才支持配置该字段。
   * @default 1
   */
  targetPriority?: number
  /**
   * 标识当前应用的所有HAP和HSP是否由打包工具生成哈希值。
   * 该字段配置为true时，该应用下的所有HAP和HSP都会由打包工具生成对应的哈希值。系统OTA升级时，若应用的versionCode保持不变，可根据哈希值判断应用是否需要升级。
   * 说明：
   * 该字段仅对预置应用生效。
   * @default false
   */
  generateBuildHash?: boolean
  /**
   * 标识应用程序是否开启GWP-asan堆内存检测工具，用于对内存越界、内存释放后使用等内存破坏问题进行分析。
   * - true：当前工程开启GWP-asan检测。
   * - false：当前工程不开启GWP-asan检测。
   * @default false
   */
  GWPAsanEnabled?: boolean
  /**
   * 标识当前模块配置的应用环境变量。
   */
  appEnvironments?: AppEnvironment[]
  /**
   * 标识当前应用自身可创建的子进程的最大个数，
   * 取值范围为0到512，0表示不限制，
   * 当应用有多个模块时，以entry模块的配置为准。
   */
  maxChildProcess?: number
  /**
   * 标识当前应用配置的多开模式。
   * 仅bundleType为app的应用的entry或feature模块配置有效，
   * 存在多个模块时，以entry模块的配置为准。
   */
  multiAppMode?: MultiAppMode
  /**
   * 标识当前应用字体大小跟随系统配置的能力。
   * 该标签是一个profile文件资源，用于指定描述应用字体大小跟随系统变更的配置文件。
   */
  configuration?: string
}

export enum AppBundleType {
  /** 当前Bundle为应用。 */
  APP = 'app',
  /** 当前Bundle为元服务。 */
  ATOMIC_SERVICE = 'atomicService',
  /** 当前Bundle为共享库应用，预留字段。 */
  SHARED = 'shared',
  /** 当前Bundle为系统级共享库应用，仅供系统应用使用。 */
  APP_SERVICE = 'appService',
}

export enum ApiReleaseType {
  /** 受限发布的版本。 */
  CANARY = 'Canary',
  /** 公开发布的Beta版本。 */
  BETA = 'Beta',
  /** 公开发布的正式版本。 */
  RELEASE = 'Release',
}

export interface DeviceConfig {
  minAPIVersion?: number
}

export interface AppEnvironment {
  /**
   * 标识环境变量的变量名称。取值为长度不超过4096字节的字符串。
   */
  name?: string
  /**
   * 标识环境变量的值。取值为长度不超过4096字节的字符串。
   */
  value?: string
}

export interface MultiAppMode {
  /**
   * 标识应用多开模式类型
   */
  multiAppModeType: MultiAppModeType
  /**
   * 标识最大允许的应用多开个数，支持的取值如下：
   * - multiInstance模式：取值范围1~10。
   * - appClone模式：取值范围1~5。
   *
   * 注意：在appClone模式下，maxCount在应用更新时不允许减小。
   */
  maxCount: number
}

export enum MultiAppModeType {
  /** 多实例模式。 */
  MULTI_INSTANCE = 'multiInstance',
  /** 应用分身模式。 */
  APP_CLONE = 'appClone',
}
