import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, extname, resolve } from 'node:path'
import { App } from '../utils/app.js'
import { AppPlusOS, PermissionRequest } from '../utils/manifest.config.js'
import { AndroidDir, UNIAPP_SDK_HOME } from '../utils/path.js'
import { enumInclude } from '../utils/util.js'
import { appendSet, mergeSet } from '../utils/xml.js'
import { appendBarcode } from './modules/barcode.js'
import { appendBluetooth } from './modules/bluetooth.js'
import { appendCamera } from './modules/camera.js'
import { appendFaceID } from './modules/face-id.js'
import { appendFacialRecognitionVerify } from './modules/facial-recognition-verify.js'
import { appendFingerprint } from './modules/fingerprint.js'
import { appendGeolocation } from './modules/geolocation.js'
import { appendIBeacon } from './modules/iBeacon.js'
import { appendLivePusher } from './modules/live-pusher.js'
import { appendMaps } from './modules/maps.js'
import { appendMessaging } from './modules/messaging.js'
import { appendOauth } from './modules/oauth.js'
import { appendPayment } from './modules/payment.js'
import { appendPush } from './modules/push.js'
import { appendRecord } from './modules/record.js'
import { appendShare } from './modules/share.js'
import { appendSpeech } from './modules/speech.js'
import { appendSQLite } from './modules/sqlite.js'
import { appendStatistic } from './modules/statics.js'
import { appendVideoPlayer } from './modules/video-player.js'
import { appendWebviewX5 } from './modules/webview-x5.js'
import {
  type AndroidManifest,
  AndroidManifestFilePath,
  appendActivity,
  appendMetaData,
  appendPermissions,
  generateAndroidManifest,
  mergeAndroidManifest,
  parsePermissionConfig,
} from './templates/AndroidManifest.xml.js'
import {
  type AppBuildGradle,
  AppBuildGradleFilePath,
  appendPackagingOptions,
  genderateAppBuildGradle,
  mergeAppBuildGradle,
  mergeDependencies,
} from './templates/app-build.gradle.js'
import {
  type BuildGradle,
  BuildGradleFilePath,
  generateBuildGradle,
  mergeBuildGradle,
} from './templates/build.gradle.js'
import { type Control, ControlFilePath, genderateDcloudControl, mergeControl } from './templates/dcloud_control.xml.js'
import {
  type Properties,
  PropertiesFilePath,
  generateDcloudProperties,
  mergeProperties,
} from './templates/dcloud_properties.xml.js'
import { LibsPath, getDefaultLibs } from './templates/libs.js'
import { type Strings, StringsFilePath, genderateStrings } from './templates/strings.xml.js'
import { resourceSizes } from './utils.js'

export interface Results {
  androidManifest: AndroidManifest
  /** 所需要的依赖文件 */
  libs: Set<string>
  /** 要写入的的文件 */
  filesWrite: Record<string, string>
  /** 要copy的文件Record<targetPath,srcPath> */
  filesCopy: Record<string, string>
  appBuildGradle: AppBuildGradle
  buildGradle: BuildGradle
  properties: Properties
  control: Control
  strings: Strings
}

function createEmptyResults(): Results {
  return {
    androidManifest: {
      application: {},
      activity: {},
    },
    libs: new Set(),
    filesWrite: {},
    filesCopy: {},
    appBuildGradle: {},
    buildGradle: {
      repositories: {},
      dependencies: new Set(),
      allRepositories: {},
      ext: {},
    },
    properties: {
      features: {},
      services: {},
    },
    control: {
      appid: '',
    },
    strings: {},
  }
}

export function mergeResults(results1: Results, results2: Results) {
  const libs = new Set()
  appendSet(libs, results1.libs)
  appendSet(libs, results2.libs)
  return {
    androidManifest: mergeAndroidManifest(results1.androidManifest, results2.androidManifest),
    libs,
    filesWrite: { ...results1.filesWrite, ...results2.filesWrite },
    appBuildGradle: mergeAppBuildGradle(results1.appBuildGradle, results2.appBuildGradle),
    buildGradle: mergeBuildGradle(results1.buildGradle, results2.buildGradle),
    properties: mergeProperties(results1.properties, results2.properties),
    control: mergeControl(results1.control, results2.control),
    strings: { ...results1.strings, ...results2.strings },
  } as Results
}

export function prepareResults(): Results {
  const manifest = App.getManifestJson()
  const results = createEmptyResults()

  // name
  results.strings.app_name = manifest.name ?? 'My UniApp'
  // appid
  results.control.appid = manifest.appid ?? ''
  // versionName
  results.appBuildGradle.versionName = manifest.versionName
  // versionCode
  results.appBuildGradle.versionCode = manifest.versionCode
  // installApkSdk
  if (manifest['app-plus']?.distribute?.android?.installApkSdk !== false) {
    results.libs.add('install-apk-release.aar')
  }

  // icons
  const icons = manifest['app-plus']?.distribute?.icons?.android || {}
  for (const size of resourceSizes) {
    if (icons[size]) {
      const iconPath = resolve(AndroidDir, 'app/src/main/res', `drawable-${size}`, `icon${extname(icons[size])}`)
      results.filesCopy[iconPath] = resolve(App.projectRoot, 'src', icons[size])
    }
  }

  const {
    dcloud_appkey,
    packagename,
    schemes,
    compileSdkVersion,
    minSdkVersion,
    targetSdkVersion,
    abiFilters,
    forceDarkAllowed,
    permissions,
    permissionExternalStorage,
    permissionPhoneState,
    packagingOptions,
    hasTaskAffinity,
    buildFeatures,
  } = manifest['app-plus']?.distribute?.android || {}
  if (dcloud_appkey) {
    appendMetaData(results.androidManifest, { dcloud_appkey: { value: dcloud_appkey } })
  }
  if (packagename) {
    results.appBuildGradle.applicationId = packagename
    results.androidManifest.package = packagename
  }
  if (compileSdkVersion) results.appBuildGradle.compileSdkVersion = compileSdkVersion
  if (minSdkVersion) results.appBuildGradle.minSdkVersion = minSdkVersion
  if (targetSdkVersion) results.appBuildGradle.targetSdkVersion = targetSdkVersion
  results.appBuildGradle.abiFilters = new Set(abiFilters)
  if (schemes) {
    const schemesArray = schemes.split(',').map((scheme) => scheme.trim())
    for (const scheme of schemesArray) {
      appendActivity(results.androidManifest, {
        'io.dcloud.PandoraEntry': {
          properties: {},
          intentFilter: [
            {
              action: new Set(['android.intent.action.VIEW']),
              category: new Set(['android.intent.category.DEFAULT', 'android.intent.category.BROWSABLE']),
              data: [{ 'android:scheme': scheme }],
            },
          ],
        },
      })
    }
  }
  if (forceDarkAllowed) {
    appendMetaData(results.androidManifest, { DCLOUD_DARK_MODE: { value: 'auto' } })
  }
  if (permissions) {
    appendPermissions(results.androidManifest, parsePermissionConfig(permissions))
  }
  if (permissionExternalStorage) {
    if (enumInclude(PermissionRequest, permissionExternalStorage.request)) {
      appendMetaData(results.androidManifest, {
        DCLOUD_WRITE_EXTERNAL_STORAGE: { value: permissionExternalStorage.request },
      })
    }
    if (permissionExternalStorage.prompt) {
      results.strings.dcloud_permission_write_external_storage_message = permissionExternalStorage.prompt
    }
  }
  if (permissionPhoneState) {
    if (enumInclude(PermissionRequest, permissionPhoneState.request)) {
      appendMetaData(results.androidManifest, {
        DCLOUD_READ_PHONE_STATE: { value: permissionPhoneState.request },
      })
    }
    if (permissionPhoneState.prompt) {
      results.strings.dcloud_permission_read_phone_state_message = permissionPhoneState.prompt
    }
  }
  if (packagingOptions) {
    appendPackagingOptions(results.appBuildGradle, new Set(packagingOptions))
  }
  if (hasTaskAffinity) {
    results.androidManifest.hasTaskAffinity = true
  }
  if (buildFeatures) results.appBuildGradle.buildFeatures = buildFeatures

  // Oauth
  appendOauth(results)
  // Bluetooth
  appendBluetooth(results)
  // Speech
  appendSpeech(results)
  // Camera
  appendCamera(results)
  // Share
  appendShare(results)
  // Geolocation
  appendGeolocation(results)
  // Push
  appendPush(results)
  // Statistic
  appendStatistic(results)
  // Barcode
  appendBarcode(results)
  // FaceID
  appendFaceID(results)
  // Fingerprint
  appendFingerprint(results)
  // FacialRecognitionVerify
  appendFacialRecognitionVerify(results)
  // iBeacon
  appendIBeacon(results)
  // LivePusher
  appendLivePusher(results)
  // Maps
  appendMaps(results)
  // Messaging
  appendMessaging(results)
  // Payment
  appendPayment(results)
  // Record
  appendRecord(results)
  // SQLite
  appendSQLite(results)
  // VideoPlayer
  appendVideoPlayer(results)
  // Webview-x5
  appendWebviewX5(results)

  // channel_list

  return results
}

export function prepareUTSResults(uts: Record<string, string>, platform = AppPlusOS.Android): Results {
  const results = createEmptyResults()

  // const modules = readdirSync(uniModulesPath, { encoding: 'utf8' })
  if (Object.keys(uts).length > 0) {
    results.libs.add('utsplugin-release.aar')

    results.appBuildGradle.dependencies = mergeDependencies(results.appBuildGradle.dependencies, {
      'com.squareup.okhttp3:okhttp:3.12.12': {},
      'androidx.core:core-ktx:1.6.0': {},
      'org.jetbrains.kotlin:kotlin-stdlib:1.8.10': {},
      'org.jetbrains.kotlin:kotlin-reflect:1.6.0': {},
      'org.jetbrains.kotlinx:kotlinx-coroutines-core:1.3.8': {},
      'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.3.8': {},
      'com.github.getActivity:XXPermissions:18.0': {},
    })

    for (const name in uts) {
      results.appBuildGradle.dependencies = mergeDependencies(results.appBuildGradle.dependencies, {
        [`:${name}`]: { project: true },
      })
      const _utsDir = resolve(uts[name], platform === AppPlusOS.Android ? 'app-android' : 'app-ios')
      // TODO:
      // https://doc.dcloud.net.cn/uni-app-x/plugin/uts-plugin.html#%E6%8F%92%E4%BB%B6%E7%9A%84%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84
      // │	│	├─assets                  //Android原生assets资源目录，可选
      // │	│	├─libs                    //Android原生库目录，可选
      // │	│	├─res                     //Android原生res资源目录，可选
      // │	│	├─AndroidManifest.xml     //Android原生应用清单文件，可选
      // │	│	├─config.json             //Android原生配置文件
      // │	│	├─hybrid.kt               //Android混编的kt文件
      // │	│	└─index.uts               //Android原生插件能力实现
    }
  }
  return results
}

export function prepare(options?: { debug?: boolean; uts?: Record<string, string>; platform?: AppPlusOS }) {
  const sdkVersion = App.getUniVersion()
  let results = prepareResults()

  if (options?.uts && Object.keys(options.uts).length) {
    const utsResult = prepareUTSResults(options.uts, options.platform)
    results = mergeResults(results, utsResult)
  }

  const { androidManifest, libs, filesWrite, filesCopy, appBuildGradle, buildGradle, properties, control, strings } =
    results
  if (options?.debug) {
    libs.add('debug-server-release.aar')
    appBuildGradle.dependencies = mergeDependencies(appBuildGradle.dependencies, {
      'com.squareup.okhttp3:okhttp:3.12.12': {},
    })
  }

  filesWrite[AndroidManifestFilePath] = generateAndroidManifest(androidManifest)
  const libFiles = mergeSet(libs, getDefaultLibs())
  for (const lib of libFiles) {
    filesCopy[resolve(AndroidDir, LibsPath, lib)] = resolve(UNIAPP_SDK_HOME, 'android', sdkVersion, lib)
  }
  filesWrite[AppBuildGradleFilePath] = genderateAppBuildGradle(appBuildGradle)
  filesWrite[BuildGradleFilePath] = generateBuildGradle(buildGradle)
  filesWrite[PropertiesFilePath] = generateDcloudProperties(properties)
  filesWrite[ControlFilePath] = genderateDcloudControl(control, options?.debug)
  filesWrite[StringsFilePath] = genderateStrings(strings)

  for (const target in filesCopy) {
    cpSync(filesCopy[target], target, { recursive: true })
  }
  for (const filePath in filesWrite) {
    const fileFullPath = resolve(AndroidDir, filePath)
    const fileDir = dirname(fileFullPath)
    if (!existsSync(fileDir)) mkdirSync(fileDir, { recursive: true })
    writeFileSync(fileFullPath, filesWrite[filePath], 'utf8')
  }
}
