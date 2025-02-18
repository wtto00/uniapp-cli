import { cp, mkdir, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { AndroidDir, App, Log, UNIAPP_SDK_HOME, exists } from '@wtto00/uniapp-common'
import { AndroidManifestFilePath, generateAndroidManifest } from './files/AndroidManifest.xml.js'
import { AppBuildGradleFilePath, genderateAppBuildGradle, mergeDependencies } from './files/app-build.gradle.js'
import { BuildGradleFilePath, generateBuildGradle } from './files/build.gradle.js'
import { ControlFilePath, genderateDcloudControl } from './files/dcloud_control.xml.js'
import { PropertiesFilePath, generateDcloudProperties } from './files/dcloud_properties.xml.js'
import { DcloudUniPluginsFilePath, generateDcloudUniPlugins } from './files/dcloud_uniplugins.json.js'
import { LibsPath, getDefaultLibs } from './files/libs.js'
import { SettingsGradleFilePath, generateSettingsGradle } from './files/settings.gradle.js'
import { StringsFilePath, genderateStrings } from './files/strings.xml.js'
import { prepareResults } from './results.js'
import { assetsAppsPath, copyWww } from './www.js'
import { mergeSet } from './xml.js'

export async function prepare(options?: { isBuild?: boolean; isHBuilderX?: boolean }) {
  Log.debug('前端打包资源嵌入 Android 资源中')
  if (await exists(assetsAppsPath)) {
    await rm(assetsAppsPath, { recursive: true })
  }
  const uts = (await copyWww(options)) ?? {}

  const sdkVersion = await App.getUniVersion()

  const results = await prepareResults(uts)

  const {
    androidManifest,
    libs,
    filesWrite,
    filesCopy,
    appBuildGradle,
    buildGradle,
    settingsGradle,
    properties,
    control,
    strings,
    plugins,
  } = results

  if (!options?.isBuild) {
    libs.add('debug-server-release.aar')
    appBuildGradle.dependencies = mergeDependencies(appBuildGradle.dependencies, {
      'com.squareup.okhttp3:okhttp:3.12.12': {},
    })
  }

  filesWrite[AndroidManifestFilePath] = generateAndroidManifest(androidManifest)
  const libFiles = mergeSet(libs, await getDefaultLibs())
  for (const lib of libFiles) {
    filesCopy[resolve(AndroidDir, LibsPath, lib)] = resolve(UNIAPP_SDK_HOME, 'android', sdkVersion, lib)
  }
  filesWrite[AppBuildGradleFilePath] = genderateAppBuildGradle(appBuildGradle)
  filesWrite[BuildGradleFilePath] = generateBuildGradle(buildGradle)
  filesWrite[SettingsGradleFilePath] = generateSettingsGradle(settingsGradle)
  filesWrite[PropertiesFilePath] = generateDcloudProperties(properties)
  filesWrite[ControlFilePath] = genderateDcloudControl(control, options?.isBuild)
  filesWrite[StringsFilePath] = genderateStrings(strings)
  filesWrite[DcloudUniPluginsFilePath] = generateDcloudUniPlugins({ nativePlugins: plugins })

  for (const target in filesCopy) {
    await cp(filesCopy[target], target, { recursive: true })
  }
  for (const filePath in filesWrite) {
    const fileFullPath = resolve(AndroidDir, filePath)
    const fileDir = dirname(fileFullPath)
    if (!(await exists(fileDir))) await mkdir(fileDir, { recursive: true })
    await writeFile(fileFullPath, filesWrite[filePath], 'utf8')
  }
}
