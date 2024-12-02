import { rmSync } from 'node:fs'
import { resolve } from 'node:path'
import { execa } from 'execa'
import Log from '../utils/log.js'
import { AndroidDir } from '../utils/path.js'
import { getGradleExePath } from './gradle.js'
import { AndroidManifestFilePath } from './templates/AndroidManifest.xml.js'
import { AppBuildGradleFilePath } from './templates/app-build.gradle.js'
import { BuildGradleFilePath } from './templates/build.gradle.js'
import { ControlFilePath } from './templates/dcloud_control.xml.js'
import { PropertiesFilePath } from './templates/dcloud_properties.xml.js'
import { DcloudUniPluginsFilePath } from './templates/dcloud_uniplugins.json.js'
import { LibsPath } from './templates/libs.js'
import { SettingsGradleFilePath } from './templates/settings.gradle.js'
import { StringsFilePath } from './templates/strings.xml.js'
import { assetsAppsPath } from './www.js'

export async function cleanAndroidBuild() {
  try {
    await execa({ stdio: 'inherit', cwd: AndroidDir })`${getGradleExePath()} clean`
  } catch {
    Log.error('gradle clean 失败')
  }
}

export function cleanAndroid() {
  const files = [
    BuildGradleFilePath,
    AppBuildGradleFilePath,
    SettingsGradleFilePath,
    LibsPath,
    assetsAppsPath,
    ControlFilePath,
    PropertiesFilePath,
    StringsFilePath,
    AndroidManifestFilePath,
    DcloudUniPluginsFilePath,
  ]
  for (const file of files) {
    rmSync(resolve(AndroidDir, file), { force: true, recursive: true })
  }
}
