/**
 * build-profile.json5
 * @link https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/ide-hvigor-build-profile-V5
 */

export interface BuildProfile {
  /**
   * 编译配置信息。
   */
  app: BuildProfileApp
  /**
   * 工程中所包含模块的信息，包含工程中所有的模块。数组长度至少为1。
   */
  modules: BuildProfileModule[]
}

export enum RuntimeOS {
  HARMONY_OS = 'HarmonyOS',
  OPEN_HARMONY = 'OpenHarmony',
}

export interface SigningConfig {
  /**
   * 签名方案的名称。
   */
  name: string
  material: SigningConfigMaterial
  /**
   * 签名类型：
   * - HarmonyOS
   * - OpenHarmony
   */
  type?: RuntimeOS
}

export interface SigningConfigMaterial {
  /**
   * 密钥库密码，以密文形式呈现。
   * 通过File > Project Structure... > Project > Signing Configs界面，进行自动签名后，material节点中的各配置项会自动填充。
   */
  storePassword: string
  /**
   * 调试或发布证书文件地址，文件后缀为.cer。
   */
  certpath: string
  /**
   * 密钥别名信息。
   */
  keyAlias: string
  /**
   * 密钥密码，以密文形式呈现。
   */
  keyPassword: string
  /**
   * 调试或发布证书Profile文件地址，文件后缀为.p7b。
   */
  profile: string
  /**
   * 密钥库signAlg参数。当前可配置值SHA256withECDSA。
   */
  signAlg?: string
  /**
   * 密钥库文件地址，文件后缀为.p12。
   */
  storeFile: string
}

export interface PackOptions {
  /**
   * 是否跳过生成签名HAP：
   * - true：跳过，即不生成签名HAP。
   * - false（缺省默认值）：不跳过，即生成签名HAP。
   *
   * 编译构建APP时，无需生成签名HAP，可将此参数修改为true，从而提升编译构建性能。
   */
  buildAppSkipSignHap?: boolean
}

export interface CompressionMedia {
  /**
   * 是否对media图片启用纹理压缩。
   * - true：启用。
   * - false（缺省默认值）：不启用。
   *
   * 说明:
   * - 在linux系统的构建场景下，请确认系统环境已[安装libGL1库](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/ide-command-line-building-app-0000001672412437-V5#section1478651816216)。
   * - 对图片进行纹理压缩会改变文件名称和内容，在[分层图标](https://developer.huawei.com/consumer/cn/doc/harmonyos-references-V5/js-apis-arkui-drawabledescriptor-V5#layereddrawabledescriptor)以及二次编辑的场景下会引起图片显示异常，请进一步使用filters排除掉这部分文件。
   */
  enable?: boolean
}

export interface Resolution {
  width: number
  height: number
}

export interface CompressionFilter {
  /**
   * 纹理压缩的方式。
   */
  method: {
    /**
     * 转换类型。
     * - astc（Adaptive Scalable Texture Compression）：自适应可变纹理压缩，一种对GPU友好的纹理格式，可在设备侧更快地显示，有更少的内存占用。
     * - sut（SUper compression for Texture） ：纹理超压缩，可在设备侧更快地显示，有更少的内存占用，相比astc具备更大压缩率和更少ROM占用。
     */
    type: 'astc' | 'sut'
    /**
     * astc/sut转换类型的扩展参数，决定画质和压缩率，当前仅支持"4x4"。
     */
    blocks: '4x4'
  }
  /**
   * 指定用来参与压缩的文件，与exclude字段配合使用。
   */
  files?: {
    /**
     * 指定“按路径匹配”的过滤条件，符合glob规范，格式为相对路径，配置示例：
     * @default
     * ```json
     * "path": [
     *   "./entry/src/main/resources/base/media/big_picture.png"
     * ]
     * ```
     */
    path?: string[]
    /**
     * 二维数组，指定“按大小匹配”的过滤条件，格式为[min,max]，闭区间，表示大小从min到max之间的文件，配置示例：
     * @default
     * ```js
     * "size"：[
     *   [0, '1k'],      // 0 ~ 1*1024
     *   ['1024', '2k'], // 1024 ~ 2*1024
     *   ['3K']          // 3*1024 ~ 无限大
     * ]
     * ```
     * - 每个数值可以填数字、字符串或字符串中带单位(大小写均可)。
     * - 单位K/k=1024，M/m=1024*1024，G/g=1024*1024*1024。
     * - 区间最大值可省略，表示无限大。
     */
    size?: ([string | number, string | number] | [string | number])[]
    /**
     * 二维数组，指定“按分辨率匹配”的过滤条件，配置示例：
     * @default
     * ```js
     * resolution:[
     *   [
     *     { width:32, height:32 },   // 最小宽高
     *     { width:64, height:64 },   // 最大宽高
     *   ],                           // 分辨率在32*32到64*64之间的图片
     *   [
     *     { width:200, height:200 }, // 最小宽高
     *     // 此处第2个不填表示最大宽高是无限大
     *   ],                           // 分辨率大于200*200的图片
     * ]
     * ```
     * - width和height只能是数字。
     * - 最大宽高可以省略，表示无限大。
     */
    resolution?: ([Resolution, Resolution] | [Resolution])[]
  }
  /**
   * 从files中剔除掉不需要压缩的文件。
   */
  exclude?: {
    /**
     * 同files/path。
     */
    path?: string[]
    /**
     * 同files/size。
     */
    size?: ([string | number, string | number] | [string | number])[]
    /**
     * 同files/resolution。
     */
    resolution?: ([Resolution, Resolution] | [Resolution])[]
  }
}

export interface Compression {
  /**
   * 对资源目录下media目录的图片进行纹理压缩的配置参数。
   */
  media?: CompressionMedia
  /**
   * 文件过滤配置参数。
   *
   * 编译过程中会依次遍历图片文件，并与filters条件进行匹配，一旦匹配成功，则完成该图片的处理。当工程级和模块级同时配置时，先按照模块级的过滤条件匹配，一旦匹配成功，则忽略工程级的过滤条件；如果模块级的没有匹配成功，继续按工程级的条件进行匹配。
   */
  filters?: CompressionFilter[]
}

export interface ResOptions {
  /**
   * 对工程预置图片资源进行纹理压缩的编译配置参数。详情请参见[表12 compression](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/ide-hvigor-build-profile-0000001778834297-V5#ZH-CN_TOPIC_0000002016325897__table18718133117173)。
   */
  compression: Compression
}

export enum AbiFilter {
  ARM64_V8A = 'arm64-v8a',
  X86_64 = 'x86_64',
}

export interface ExternalNativeOptions {
  /**
   * CMake构建脚本地址，即CMakeLists.txt文件地址。
   */
  path?: string
  /**
   * 本机的ABI编译环境
   *
   * @default 'arm64-v8a'
   */
  abiFilters?: AbiFilter[]
  /**
   * CMake编译参数。
   */
  arguments?: string | string[]
  /**
   * C++编译器参数。
   */
  cppFlags?: string
}

export interface SourceOption {
  /**
   * 指定使用node.js工作器的JS/TS源代码，源代码在构建过程中单独处理。
   */
  workers?: []
}

export interface NativeLibFilterSelect {
  /**
   * 包名
   */
  package?: string
  /**
   * 包版本
   */
  version?: string
  /**
   * 选择打包的native产物
   */
  include?: string[]
  /**
   * 排除的native产物
   */
  exclude?: string[]
}

export interface NativeLibFilter {
  /**
   * 排除的.so文件。罗列的NAPI库将不会被打包。
   */
  excludes?: string[]
  /**
   * 按照.so文件的优先级顺序，打包最高优先级的.so文件。详情请参见关于库文件so的优先级。
   */
  pickFirsts?: string[]
  /**
   * 按照.so文件的优先级顺序，打包最低优先级的.so文件。详情请参见关于库文件so的优先级。
   */
  pickLasts?: string[]
  /**
   * 是否允许当.so文件重名冲突时，使用高优先级的.so文件覆盖低优先级的.so文件：
   * - true：允许。
   * - false（缺省默认值）：不允许。
   */
  enableOverride?: boolean
  /**
   * select提供native产物的精准选择能力，根据包名、版本、产物名称等选择或排除，select的优先级高于excludes、pickFirsts等配置项。
   * 详情请参见关于[select的使用](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/ide-hvigor-cpp-0000001733922376-V5#section14491810432)。
   */
  select?: NativeLibFilterSelect[]
}

export interface NativeLib {
  /**
   * Native 库（.so）文件的筛选选项。配置后优先级高于napiLibFilterOption。
   */
  filter?: NativeLibFilter
  /**
   * 移除.so文件中的符号表、调试信息。
   */
  debugSymbol?: {
    /**
     * 是否移除.so文件中的符号表、调试信息。
     * - true（缺省默认值）：移除。
     * - false：不移除。
     *
     * 从DevEco Studio NEXT Developer Beta2（5.0.3.502）版本开始，缺省默认值由false改为true。
     */
    strip?: boolean
    /**
     * 不对.so文件执行strip的正则表达式规则集。
     */
    exclude?: string[]
  }
  /**
   * 指向包含要导出到此模块的依赖项的标头的目录的路径。
   */
  headerPath?: string | string[]
  /**
   * 对libs目录收集打包时，是否收集所有后缀的文件。
   * - true：不限制后缀，即收集所有文件（包括无后缀文件）。
   * - false（缺省默认值）：限制后缀为.so，即只收集后缀为.so的文件。
   */
  collectAllLibs?: boolean
}

export interface NapiLibFilterOption {
  /**
   * 排除的.so文件。罗列的NAPI库将不会被打包。
   */
  excludes?: string[]
  /**
   * 按照.so文件的优先级顺序，打包最高优先级的.so文件。
   */
  pickFirsts?: string[]
  /**
   * 按照.so文件的优先级顺序，打包最低优先级的.so文件。
   */
  pickLasts?: string[]
  /**
   * 是否允许当.so文件重名冲突时，使用高优先级的.so文件覆盖低优先级的.so文件：
   * - true：允许。
   * - false（缺省默认值）：不允许。
   */
  enableOverride?: boolean
}

export interface ArkOptions {
  /**
   * 应用热点信息文件路径。
   *
   * API 11及以上版本不再支持，即该字段配置后不再生效。
   */
  apPath?: string
  /**
   * 用于ArkTS的构建配置。
   * 自定义类型，key可由数字、英文和下划线、中划线组成，value类型仅可以为string、number、boolean。
   */
  buildProfileFields?: Record<string, string | number | boolean>
  /**
   * 是否启用配置文件引导优化功能：
   * - true：启用。
   * - false（缺省默认值）：不启用。
   * 从API 10开始废弃，由于partial模式可能存在兼容性问题，请使用Target AOT能力，不建议使用Host AOT。
   */
  hostPGO?: boolean
  /**
   * 自定义类型，可配置包名或d.ts/d.ets文件路径。
   */
  types?: string[]
  /**
   * 与编译TS语法相关的配置选项。
   */
  tscConfig?: {
    /**
     * 指定TS语法编译产物的目标运行时EcmaScript版本，包括：
     * - ES2017
     * - ES2021（缺省默认值）。
     */
    targetESVersion?: 'ES2017' | 'ES2021'
  }
}

export interface StrictMode {
  /**
   * 是否严格检查绝对路径导入方式和相对路径跨模块导入方式。
   * - true：严格检查。
   * - false（缺省默认值）：不严格检查。
   */
  noExternalImportByPath?: boolean
  /**
   * 是否使用标准化的OHMUrl（OHMUrl的定义参考以下说明）格式，标准化的OHMUrl统一了原有OHMUrl的格式。使用集成态HSP和字节码HAR需使用标准化的OHMUrl格式。
   * - true：使用标准化的OHMUrl格式。
   * - false（缺省默认值）：不使用标准化的OHMUrl格式。
   *
   * 说明
   * - 从API 12开始支持。
   * - 一个ets文件在编译后会成为安装包的一部分，这个ets文件对应的字节码称为一个字节码段，OHMUrl是用来定位一个字节码段的标识。
   * - 工程里所有的OHMUrl格式需统一。若引用了HAR/HSP，需确保HAR/HSP的OHMUrl格式与工程级build-profile.json5中的配置一致。
   */
  useNormalizedOHMUrl?: boolean
  /**
   * 导入文件是否严格校验大小写，支持相对路径和软链接。
   * - true：严格校验。
   * - false（缺省默认值）：不严格校验。
   */
  caseSensitiveCheck?: boolean
  /**
   * 是否校验本地HSP模块有无依赖相同的HAR。仅在Build App(s)起效。
   * - true：如果本地HSP模块依赖了相同的HAR（包括本地/远程、直接/间接），则编译报错。（注意：当依赖链中存在远程HSP，则该远程HSP及其依赖链不参与校验）。
   * - false（默认缺省值）：不启用校验。
   * @default false
   */
  duplicateDependencyCheck?: boolean
  /**
   * 是否对HAR产物启用本地依赖校验。
   * - true：如果oh-package.json中的dependencies、dynamicDependencies存在本地依赖，则编译报错。
   * - false（默认缺省值）：不启用校验。
   *
   * 除HAR模块外，HSP模块编译时也会生成HAR产物，该配置同样生效。
   * @default false
   */
  harLocalDependencyCheck?: boolean
}

export interface BuildOptions {
  /**
   * 打包相关配置项。
   */
  packOptions?: PackOptions
  /**
   * 当前编译产物是否为可调试模式：
   * - true（缺省默认值）：可调试。
   * - false：不可调试。
   *
   * 当使用release的编译模式时，默认为false。
   * 工程级别buildOption配置会与模块级别的buildOption进行合并，具体合并规则请参考[合并编译选项规则](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/ide-hvigor-compilation-options-customizing-guide-0000001731595148-V5#section1727865610255)。
   */
  debuggable?: boolean
  /**
   * 资源编译配置项。
   */
  resOptions?: ResOptions
  /**
   * Native编译配置项。
   */
  externalNativeOptions?: ExternalNativeOptions
  /**
   * 源码相关配置。使用不同的标签对源代码进行分类，以便在构建过程中对不同的源代码进行不同的处理。
   */
  sourceOption?: SourceOption
  /**
   * Native 库（.so）相关配置。
   */
  nativeLib?: NativeLib
  /**
   * NAPI库（.so）文件的筛选选项。标记为废弃，不建议使用，推荐使用nativeLib/filter。
   */
  napiLibFilterOption?: NapiLibFilterOption
  /**
   * ArkTS 编译配置。
   */
  arkOptions?: ArkOptions
  /**
   * 严格模式。
   */
  strictMode?: StrictMode
  /**
   * 指定Native编译时使用的编译器，包括：
   * - Original（缺省默认值）：原有的编译器。
   * - BiSheng：使用[毕昇编译器](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/bisheng-compiler-V5)进行Native编译。
   */
  nativeCompiler?: 'Original' | 'BiSheng'
}

export interface Resource {
  /**
   * 资源地址路径。配置示例：
   * @default
   * ```js
   * "directories": [
   *     './AppScope/resource'
   * ]
   * ```
   */
  directories: string[]
}

export interface Output {
  /**
   * 自定义产品生成的应用包名称，名称可由数字、英文字母、中划线、下划线和英文句号（.）组成。
   */
  artifactName: string
}

export interface Product {
  /**
   * 产品的名称，必须存在name为"default"的product。
   */
  name: string
  /**
   * 产品的签名方案名称，即signingConfigs中配置的某个签名方案名称。
   */
  signingConfig?: string
  /**
   * 产品的包名。
   */
  bundleName?: string
  /**
   * 产品的编译构建配置
   */
  buildOption?: BuildOptions
  /**
   * 产品的运行环境：
   * - HarmonyOS
   * - OpenHarmony
   */
  runtimeOS?: RuntimeOS
  /**
   * ArkTS语法检查工具的版本号：1.0，1.1。
   * 默认为当前ArkTS语法检查工具支持的最新版本。
   * 仅API 11及以上版本工程支持。
   */
  arkTSVersion?: string
  /**
   * 编译时的SDK版本。
   * - 运行环境是HarmonyOS时，字段类型为string，配置示例：4.1.0(11)
   * - 运行环境是OpenHarmony时，字段类型为integer，配置示例：11
   *
   * compatibleSdkVersion与targetSdkVersion字段注意事项相同，后续不再赘述。
   */
  compileSdkVersion?: string | number
  /**
   * 兼容的最低SDK版本。
   */
  compatibleSdkVersion?: string | number
  /**
   * 用于控制不同beta版本的兼容，可配置值为：beta1，beta2，beta3。该字段只在API 12有效，默认值为beta1。
   *
   * 配置betaX就能生成在对应betaX版本镜像上运行的应用，开发者无需升级配套版本镜像，但是无法使用高于betaX版本的特性，例如beta3版本提供的sendable function和lazy import两个特性在配置beta2或beta1时无法正常使用。
   */
  compatibleSdkVersionStage?: 'beta1' | 'beta2' | 'beta3'
  /**
   * 应用/服务运行的目标SDK版本。如未配置，默认与compileSdkVersion保持一致。
   *
   * targetSdkVersion字段在当前版本已废弃。
   * 如果之前未配置targetSdkVersion，targetSdkVersion的值将与配套的SDK版本保持一致。
   */
  targetSdkVersion?: string | number
  /**
   * 包的类型：
   * - app：应用
   * - atomicService：元服务
   * - shared：共享包
   */
  bundleType?: 'app' | 'atomicService' | 'shared'
  /**
   * 应用/服务名称。配置示例："$string:app_name"。
   * 配置products中的label、icon、versionCode、versionName、resource字段后，
   * 编译构建时将根据此处的配置替换 app.json5中的相关配置，常用于应用和元服务可分可合构建打包场景。
   */
  label?: string
  /**
   * 应用图标。配置示例："$media:application_icon"。
   */
  icon?: string
  /**
   * 版本号。配置示例：1000000。
   */
  versionCode?: number
  /**
   * 版本名称。配置示例："1.0.0"。
   */
  versionName?: string
  /**
   * 名称和图标对应的资源所在目录。
   */
  resource: Resource
  /**
   * 定制产品生成的应用包的配置
   */
  output?: Output
  /**
   * 供应商。
   */
  vendor?: string
}

export interface BuildModeSet {
  /**
   * 构建模式名称。
   * 默认生成debug，release和test三个名称，支持开发者自定义，其中test模式仅在执行ohosTest测试套件时使用。
   */
  name: string
  /**
   * 构建模式使用的具体配置信息
   */
  buildOption?: BuildOptions
}

export interface BuildProfileApp {
  /**
   * 签名方案信息，可配置多个。
   */
  signingConfigs?: SigningConfig[]
  /**
   * 产品品类，可配置多个。如需配置多个，相关说明请参见配置多目标产物章节。
   */
  products?: Product[]
  /**
   * 构建模式合集，可配置多个。
   */
  buildModeSet?: BuildModeSet[]
  /**
   * 当前工程是否支持多工程构建：
   * - true：支持。
   * - false（缺省默认值）：不支持。
   */
  multiProjects?: boolean
}

export interface BuildProfileModuleTarget {
  /**
   * target名称，在各个模块级build-profile.json5中的targets字段定义。
   */
  name?: string[]
  /**
   * target关联的product。
   */
  applyToProducts?: string[]
}

export interface BuildProfileModule {
  /**
   * 模块的名称。该名称需与module.json5文件中的module.name保持一致。
   *
   * 在FA模型中，对应的文件为config.json。
   */
  name: string
  /**
   * 模块的源码路径，为模块根目录相对工程根目录的相对路径，允许模块根目录不在当前工程下，详情请参考导入Module。
   */
  srcPath: string
  /**
   * 模块的target信息，用于定制多目标构建产物。
   *
   * 更多关于多目标构建产物的内容，请参见[配置多目标产物](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/ide-customized-multi-targets-and-products-0000001731754292-V5)章节。
   */
  targets?: BuildProfileModuleTarget[]
}
