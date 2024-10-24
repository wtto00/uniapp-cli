import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { type ManifestConfig, PermissionRequest } from '../utils/manifest.config.js'
import { UNIAPP_SDK_HOME, androidDir } from '../utils/path.js'
import { appendSet, enumInclude, mergeSet } from '../utils/util.js'
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
import { type Strings, StringsFilePath, genderateStrings } from './templates/strings.xml.js'
import { findLibSDK } from './utils.js'

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

export function getDefaultLibs(sdkVersion: string) {
  const libs = new Set(['lib.5plus.base-release.aar', 'uniapp-v8-release.aar', 'breakpad-build-release.aar'])

  const androidGifDrawableRelease = findLibSDK('android-gif-drawable-release@', sdkVersion)
  if (androidGifDrawableRelease) libs.add(androidGifDrawableRelease)

  const oaidSdk = findLibSDK('oaid_sdk_', sdkVersion)
  if (oaidSdk) libs.add(oaidSdk)

  return libs
}

export function prepareResults(manifest: ManifestConfig, sdkVersion: string): Results {
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
      results.androidManifest.activity['io.dcloud.PandoraEntry'].intentFilter = []
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
  appendOauth(results, manifest)
  // Bluetooth
  appendBluetooth(results, manifest)
  // Speech
  appendSpeech(results, manifest)
  // Camera
  appendCamera(results, manifest)
  // Share
  appendShare(results, manifest, sdkVersion)
  // Geolocation
  appendGeolocation(results, manifest)
  // Push
  appendPush(results, manifest)
  // Statistic
  appendStatistic(results, manifest)
  // Barcode
  appendBarcode(results, manifest)
  // FaceID
  appendFaceID(results, manifest)
  // Fingerprint
  appendFingerprint(results, manifest)
  // FacialRecognitionVerify
  appendFacialRecognitionVerify(results, manifest, sdkVersion)
  // iBeacon
  appendIBeacon(results, manifest)
  // LivePusher
  appendLivePusher(results, manifest)
  // Maps
  appendMaps(results, manifest)
  // Messaging
  appendMessaging(results, manifest)
  // Payment
  appendPayment(results, manifest)
  // Record
  appendRecord(results, manifest)
  // SQLite
  appendSQLite(results, manifest)
  // VideoPlayer
  appendVideoPlayer(results, manifest)
  // Webview-x5
  appendWebviewX5(results, manifest)

  // channel_list

  return results
}

export function prepareUTSResults(uniModulesPath: string): Results {
  const results = createEmptyResults()

  const modules = readdirSync(uniModulesPath, { encoding: 'utf8' })
  if (modules.length > 0) {
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

    for (const uts of modules) {
      results.appBuildGradle.dependencies = mergeDependencies(results.appBuildGradle.dependencies, {
        [`:${uts}`]: { project: true },
      })
    }
  }
  return results
}

export function prepare(manifest: ManifestConfig, sdkVersion: string) {
  const results = prepareResults(manifest, sdkVersion)

  const { androidManifest, libs, filesWrite, filesCopy, appBuildGradle, buildGradle, properties, control, strings } =
    results

  filesWrite[AndroidManifestFilePath] = generateAndroidManifest(androidManifest)
  const libFiles = mergeSet(libs, getDefaultLibs(sdkVersion))
  for (const lib of libFiles) {
    filesCopy[resolve(androidDir, 'app/libs', lib)] = resolve(UNIAPP_SDK_HOME, 'android', sdkVersion, lib)
  }
  filesWrite[AppBuildGradleFilePath] = genderateAppBuildGradle(appBuildGradle)
  filesWrite[BuildGradleFilePath] = generateBuildGradle(buildGradle)
  filesWrite[PropertiesFilePath] = generateDcloudProperties(properties)
  filesWrite[ControlFilePath] = genderateDcloudControl(control)
  filesWrite[StringsFilePath] = genderateStrings(strings)

  for (const target in filesCopy) {
    cpSync(filesCopy[target], target, { recursive: true })
  }
  for (const filePath in filesWrite) {
    const fileFullPath = resolve(androidDir, filePath)
    const fileDir = dirname(fileFullPath)
    if (!existsSync(fileDir)) mkdirSync(fileDir, { recursive: true })
    writeFileSync(fileFullPath, filesWrite[filePath], 'utf8')
  }
}
