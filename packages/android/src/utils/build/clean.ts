import { rmSync } from 'node:fs'
import { join } from 'node:path'
import { projectDir } from '../const.js'
import { AndroidManifestFilePath } from '../prepare/files/AndroidManifest.xml.js'
import { AppBuildGradleFilePath } from '../prepare/files/app-build.gradle.js'
import { BuildGradleFilePath } from '../prepare/files/build.gradle.js'
import { ControlFilePath } from '../prepare/files/dcloud_control.xml.js'
import { PropertiesFilePath } from '../prepare/files/dcloud_properties.xml.js'
import { DcloudUniPluginsFilePath } from '../prepare/files/dcloud_uniplugins.json.js'
import { LibsPath } from '../prepare/files/libs.js'
import { SettingsGradleFilePath } from '../prepare/files/settings.gradle.js'
import { StringsFilePath } from '../prepare/files/strings.xml.js'
import { assetsAppsPath } from '../www.js'
import { execGradleCommand } from './gradle.js'

export async function cleanAndroidBuild(projectInfo: ProjectInfo) {
  const {
    Log,
    utils: { errorDebugLog },
  } = projectInfo

  try {
    await execGradleCommand(projectInfo, 'clean')
  } catch (error) {
    errorDebugLog(error)
    Log.error('gradle clean 失败')
  }
}

export function cleanAndroid(projectInfo: ProjectInfo) {
  const { root } = projectInfo

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
    rmSync(join(root, projectDir, file), { force: true, recursive: true })
  }
}
