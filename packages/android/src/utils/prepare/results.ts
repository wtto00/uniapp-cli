import { extname, join, resolve } from 'node:path'
import { AndroidDir, App, PermissionRequest, enumInclude } from '@wtto00/uniapp-common'
import { resourceSizes } from '../const.js'
import {
  type AndroidManifest,
  appendActivity,
  appendMetaData,
  appendPermissions,
  mergeAndroidManifest,
  parsePermissionConfig,
} from './files/AndroidManifest.xml.js'
import { type AppBuildGradle, appendPackagingOptions, mergeAppBuildGradle } from './files/app-build.gradle.js'
import { type BuildGradle, mergeBuildGradle } from './files/build.gradle.js'
import { type Control, mergeControl } from './files/dcloud_control.xml.js'
import { type Properties, mergeProperties } from './files/dcloud_properties.xml.js'
import type { DcloudUniPlugin } from './files/dcloud_uniplugins.json.js'
import type { Strings } from './files/strings.xml.js'
import { appendAd } from './modules/ad.js'
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
import { appendPlugins } from './native-plugins.js'
import { appendSplashScreen } from './splashscreen.js'
import { appendUTS } from './uts.js'
import { appendSet, mergeSet } from './xml.js'

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
  settingsGradle: Set<string>
  properties: Properties
  control: Control
  strings: Strings
  // nativePlugins
  plugins: DcloudUniPlugin[]
}

export function createEmptyResults(): Results {
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
    settingsGradle: new Set(),
    properties: {
      features: {},
      services: {},
    },
    control: {
      appid: '',
    },
    strings: {},
    plugins: [],
  }
}

export function mergeResults(results1: Results, results2: Results): Results {
  const libs = new Set<string>()
  appendSet(libs, results1.libs)
  appendSet(libs, results2.libs)
  return {
    androidManifest: mergeAndroidManifest(results1.androidManifest, results2.androidManifest),
    libs,
    filesWrite: { ...results1.filesWrite, ...results2.filesWrite },
    filesCopy: { ...results1.filesCopy, ...results2.filesCopy },
    appBuildGradle: mergeAppBuildGradle(results1.appBuildGradle, results2.appBuildGradle),
    buildGradle: mergeBuildGradle(results1.buildGradle, results2.buildGradle),
    settingsGradle: mergeSet(results1.settingsGradle, results2.settingsGradle),
    properties: mergeProperties(results1.properties, results2.properties),
    control: mergeControl(results1.control, results2.control),
    strings: { ...results1.strings, ...results2.strings },
    plugins: [...results1.plugins, ...results2.plugins],
  }
}

export async function prepareResults(uts: Record<string, string>): Promise<Results> {
  const results = createEmptyResults()

  const manifest = await App.getManifestJson()

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
      const iconPath = join(AndroidDir, 'app/src/main/res', `drawable-${size}`, `icon${extname(icons[size])}`)
      results.filesCopy[iconPath] = resolve(App.projectRoot, 'src', icons[size])
    }
  }

  // splashscreen
  await appendSplashScreen(results)

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
  // permissions
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
  await appendOauth(results)
  // Bluetooth
  await appendBluetooth(results)
  // Speech
  await appendSpeech(results)
  // Camera
  await appendCamera(results)
  // Share
  await appendShare(results)
  // Geolocation
  await appendGeolocation(results)
  // Push
  await appendPush(results)
  // Statistic
  await appendStatistic(results)
  // Barcode
  await appendBarcode(results)
  // ad
  await appendAd(results)
  // FaceID
  await appendFaceID(results)
  // Fingerprint
  await appendFingerprint(results)
  // FacialRecognitionVerify
  await appendFacialRecognitionVerify(results)
  // iBeacon
  await appendIBeacon(results)
  // LivePusher
  await appendLivePusher(results)
  // Maps
  await appendMaps(results)
  // Messaging
  await appendMessaging(results)
  // Payment
  await appendPayment(results)
  // Record
  await appendRecord(results)
  // SQLite
  await appendSQLite(results)
  // VideoPlayer
  await appendVideoPlayer(results)
  // Webview-x5
  await appendWebviewX5(results)

  // channel_list

  // native plugins
  await appendPlugins(results)

  // uts uni_moudles
  await appendUTS(results, uts)

  return results
}
