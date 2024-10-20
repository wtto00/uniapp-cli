import { PermissionRequest, type ManifestConfig } from '@uniapp-cli/common'
import {
  appendActivity,
  appendMetaData,
  appendPermissions,
  mergeAndroidManifest,
  parsePermissionConfig,
  type AndroidManifest,
} from './templates/AndroidManifest.xml'
import {
  appendPackagingOptions,
  mergeAppBuildGradle,
  mergeDependencies,
  type AppBuildGradle,
} from './templates/app-build.gradle'
import { mergeBuildGradle, type BuildGradle } from './templates/build.gradle'
import { mergeProperties, type Properties } from './templates/dcloud_properties.xml'
import type { Strings } from './templates/strings.xml'
import { mergeControl, type Control } from './templates/dcloud_control.xml'
import { resolve } from 'path'
import { readdirSync } from 'fs'
import { appendSet, enumInclude } from '../utils/util'
import { appendOauth } from './modules/oauth'
import { appendBluetooth } from './modules/bluetooth'
import { findLibSDK } from './utils'

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

export function getDefaultLibs() {
  const libs = new Set(['lib.5plus.base-release.aar', 'uniapp-v8-release.aar', 'breakpad-build-release.aar'])

  const libsPath = resolve(global.projectRoot, 'node_modules/uniapp-android/SDK/libs')
  const files = readdirSync(libsPath, { encoding: 'utf8' })

  const androidGifDrawableRelease = findLibSDK('android-gif-drawable-release@')
  if (androidGifDrawableRelease) libs.add(androidGifDrawableRelease)

  const oaidSdk = files.find((file) => file.startsWith('oaid_sdk_'))
  if (oaidSdk) libs.add(oaidSdk)

  return libs
}

export function prepare(manifest: ManifestConfig): Results {
  const results = createEmptyResults()

  // name
  results.strings['app_name'] = manifest.name ?? 'My UniApp'
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
    schemesArray.forEach((scheme) => {
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
    })
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

  // channel_list

  return results
}

export function prepareUTS(uniModulesPath: string): Results {
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

    modules.forEach((uts) => {
      results.appBuildGradle.dependencies = mergeDependencies(results.appBuildGradle.dependencies, {
        [`:${uts}`]: { project: true },
      })
    })
  }
  return results
}
